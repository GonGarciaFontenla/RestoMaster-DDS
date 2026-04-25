# Fundamentación Técnica — Bonus Track: Autenticación y Autorización con JWT

## Introducción

Esta sección documenta las decisiones de diseño e implementación de la capa de seguridad añadida como bonus a la Entrega 2. El sistema implementa **autenticación sin estado (stateless)** basada en JSON Web Tokens y **autorización basada en roles (RBAC)** mediante middlewares de Express.

---

## 1. Autenticación Stateless con JWT

### ¿Por qué JWT y no sesiones en servidor?

RestoMaster no guarda sesiones en memoria ni en base de datos. En su lugar, usa el estándar **JWT (JSON Web Token)**: cada petición lleva consigo un token firmado que contiene toda la información necesaria para identificar al usuario.

**Justificación:** Las sesiones en servidor (almacenadas en memoria o Redis) acoplan la aplicación a una instancia específica del proceso. JWT elimina este acoplamiento: cualquier instancia del servidor puede verificar el token de forma independiente validando la firma con el `JWT_SECRET`, lo que habilita la escalabilidad horizontal sin infraestructura adicional de sesiones compartidas. Este es el principio de **Statelessness** de REST.

### Flujo de login seguro

```
Cliente → POST /auth/login → [Zod valida email+password] → UserController → UserService
  1. Se busca el usuario por email en el repositorio.
  2. bcrypt.compare() verifica la contraseña enviada contra el hash almacenado.
  3. Si es válida, jwt.sign() genera un token firmado con { id, tipo, restauranteId }.
  4. El token se entrega vía cookie HttpOnly (inaccesible desde JavaScript del browser).
  5. La respuesta incluye los datos del usuario sin la contraseña.
```

**¿Por qué `bcrypt`?** `bcrypt` es una función de *hashing* de contraseñas con sal incorporada (salt). A diferencia del cifrado reversible, el hash no puede "desencriptarse": para verificar una contraseña, `bcrypt.compare()` hashea el valor recibido y compara el resultado con el hash almacenado. Esto garantiza que, incluso si la base de datos es comprometida, las contraseñas originales no pueden recuperarse.

**¿Por qué cookie `HttpOnly` y no `Authorization` header?** La cookie `HttpOnly` no puede ser leída desde JavaScript del navegador, protegiéndola de ataques XSS (Cross-Site Scripting). El middleware `authenticate` acepta ambas formas (cookie o header `Authorization: Bearer <token>`) para compatibilidad con clientes móviles o APIs consumidas por terceros.

---

## 2. Autorización Basada en Roles (RBAC) mediante Middlewares

### Los dos middlewares de seguridad

La autorización se implementa en `src/middlewares/auth.js` con dos funciones bien diferenciadas:

```js
// 1. Verifica identidad — ¿Quién sos?
authenticate(req, res, next)

// 2. Verifica permisos — ¿Tenés permiso para esto?
requireRole(...roles)(req, res, next)
```

**Justificación:** Separar autenticación de autorización respeta el **Principio de Responsabilidad Única (SRP)**. `authenticate` solo valida que el token sea legítimo y lo decodifica; `requireRole` solo verifica que el rol del usuario esté en la lista de roles permitidos para esa operación. Si mañana se añade un nuevo mecanismo de autenticación (OAuth, API keys), `requireRole` no necesita cambiar.

### Códigos HTTP correctos

| Situación | Código | Semántica |
|-----------|--------|-----------|
| No se envió token | `401 Unauthorized` | No estás identificado |
| Token inválido o expirado | `401 Unauthorized` | Tu identidad no puede verificarse |
| Token válido pero rol insuficiente | `403 Forbidden` | Te conozco, pero no tenés acceso |

Esta distinción es importante: `401` indica un problema de *autenticación* (quién sos), `403` indica un problema de *autorización* (qué podés hacer).

### Flujo integrado en las rutas

Los middlewares se encadenan como guardias sucesivos antes de que lleguen a los controladores:

```js
router.post(
  "/",
  authenticate,                          // 1. ¿Tenés token válido?
  requireRole(TipoUsuario.ADMIN),        // 2. ¿Sos ADMIN?
  validateSchema(productoSchema),        // 3. ¿El body es válido?
  menuController.addPlato.bind(...)      // 4. Recién ahora se ejecuta la lógica
);
```

**Justificación:** Esta secuencia aplica el principio **Fail-Fast**: cada guardia aborta la cadena lo antes posible si una condición no se cumple. Al delegar los errores al `errorHandler` centralizado mediante `next(new AppError(...))`, todos los errores de seguridad siguen el mismo formato de respuesta que el resto del sistema.

---

## 3. Separación de Responsabilidades en las Rutas de Usuario

Las rutas de usuario están divididas en dos archivos:

- **`AuthRoutes.js`** (`/auth`): rutas de sesión — `POST /login`, `POST /logout`, `GET /me`. No requieren roles, solo gestión de identidad.
- **`UserRoutes.js`** (`/usuarios`): rutas de gestión de empleados — CRUD protegido exclusivamente por `requireRole(ADMIN)`.

**Justificación:** Mezclar autenticación con gestión de usuarios en un solo archivo viola el **SRP**: el motivo de cambio de las rutas de sesión (cambiar el mecanismo de auth) es distinto al de las rutas de CRUD (cambiar las reglas de acceso a usuarios). La separación hace que cada archivo tenga una sola razón para cambiar.

---

## 4. Protección de Datos Sensibles

### Contraseña nunca expuesta en respuestas

`UserService.login()` omite el campo `password` del objeto devuelto antes de que llegue al controlador:

```js
const { password: _, ...userSinPassword } = user._doc ?? user;
return { token, user: userSinPassword };
```

El `UserDTO` (`UserREST`) refuerza esto como segunda barrera: solo expone `id`, `nombre`, `email` y `tipo`.

### `restauranteId` nunca editable por el cliente

`UserService.updateUser()` desestructura y descarta `restauranteId` del body antes de persistir cambios:

```js
const { restauranteId, ...datosPermitidos } = updateData;
```

Esto garantiza que ningún cliente pueda reasignar un usuario a otro restaurante, incluso si envía ese campo en el body.

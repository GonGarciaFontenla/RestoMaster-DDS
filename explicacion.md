## Desafío Opcional (Bonus Track): Seguridad y Sesiones

Atendiendo al desafío opcional sugerido por nuestro Tech Leader, decidimos agregar un verdadero valor diferencial a la plataforma implementando una capa de **Autenticación y Autorización basada en Roles** de la que estamos muy orgullosos. Para esto, nuestro sistema es capaz de proteger endpoints vitales y prevenir accesos malintencionados operando bajo los siguientes principios:

### Autenticación "Stateless" con JWT
RestoMaster no guarda sesiones interactivas conectadas a su propia memoria, logrando así que nuestra base de código sea escalable ante la alta demanda computacional. En su lugar, hemos implementado el estándar `JWT` (JSON Web Tokens).

1. **Login Seguro:** Dentro de `UserController`, cuando un usuario busca acceder con sus credenciales, nuestro sistema utiliza la librería criptográfica `bcrypt` para cruzar contraseñas cacheadas sin exponer nuestra base de datos.
2. **Generación del Token:** Si el acceso es válido, nosotros (a través del secreto `JWT_SECRET`) emitimos, firmamos y devolvemos un token que empaqueta la identidad y el **rol** exacto de quien se acaba de loguear (`ADMIN`, `MOZO`, etc.).

### Autorización Perimetral mediante Middlewares
Una vez el usuario posee un token válido, implementamos controles de acceso y los ubicamos como barreras o "escudos" previos a nuestros Controladores de Negocio. Podrán apreciarlos operando en la carpeta `src/middlewares/auth.js`:

- **Middleware `authenticate`**: Comprueba meticulosamente si la llamada HTTP está adjuntando el JWT que expedimos (sea por Cookie o cabecera `Authorization`), validando su firma localmente para descartar falsificaciones.
- **Middleware `requireRole`**: Verifica explícitamente el perfil del usuario autenticado cruzándolo contra la operación de turno.

#### Aplicación Práctica en las Rutas
Hemos aplicado esta poderosa capa rodeando todos los endpoints. Un ejemplo concreto sucede en `MenuRoutes.js`:

```javascript
router.post(
  "/",
  authenticate,
  requireRole(TipoUsuario.ADMIN),
  validateSchema(productoSchema),
  menuController.addPlato.bind(menuController)
);
```
En este flujo interceptado, nosotros garantizamos por completo que solo un perfil categorizado como **ADMIN** podrá crear formalmente nuevos platos o mesas. 
Si el sistema detecta a un `MOZO` o un intento huérfano sin identificarse, automáticamente se deniega el acceso resolviendo la petición con estados de error `HTTP 401` o `HTTP 403` correspondientemente.

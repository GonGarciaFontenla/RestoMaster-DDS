# RestoMaster — Iteraciones 1, 2 y 3 (+ Bonus: Auth JWT)

## 🎯 Objetivo de esta iteración

Sobre la base del modelo de dominio de la Iteración 1, se agregan las **capas de servicio, controladores, rutas y DTOs** para exponer la lógica de negocio como una API REST consumible por cualquier cliente HTTP.

---

## 📁 Estructura de archivos nueva en esta iteración

```
src/
├── services/
│   ├── MesasService.js       → Lógica de negocio para mesas
│   ├── MenuService.js        → Lógica de negocio para el menú
│   ├── PedidosService.js     → Lógica de negocio para comandas
│   ├── ReservasService.js    → Lógica de negocio para reservas
│   └── UserService.js        → [Bonus] Login, registro y gestión de usuarios
├── controllers/
│   ├── MesasController.js
│   ├── MenuController.js
│   ├── PedidosController.js
│   ├── ReservasController.js
│   └── UserController.js     → [Bonus] Login, logout, CRUD de usuarios, /me
├── routes/
│   ├── MesasRoutes.js        → [Bonus] Protegidas con authenticate + requireRole
│   ├── MenuRoutes.js         → [Bonus] Protegidas con authenticate + requireRole
│   ├── PedidosRoutes.js      → [Bonus] Protegidas con authenticate + requireRole
│   ├── ReservasRoutes.js     → [Bonus] Protegidas con authenticate + requireRole
│   └── AuthRoutes.js         → [Bonus] /login, /logout, /me, /users
├── dtos/
│   ├── MesasDTO.js
│   ├── PlatoDTO.js
│   ├── ReservaDTO.js
│   └── UserDTO.js            → [Bonus] Nunca expone password ni restauranteId
├── middlewares/
│   ├── errorHandler.js
│   ├── validator.js
│   └── auth.js               → [Bonus] authenticate (JWT) + requireRole (roles)
├── validations/
│   ├── mesaSchema.js
│   ├── productoSchema.js
│   ├── reservaSchema.js
│   ├── comandaSchema.js
│   ├── itemComandaSchema.js
│   └── userSchema.js         → [Bonus] Validación de datos de usuario
└── app/
    └── context.js

index.js
.env.example                  → [Bonus] Variables de entorno requeridas
```

---

## 🏗️ Arquitectura en Capas

```
Request HTTP
    ↓
[ Router ]           → define la URL y delega al Controller
    ↓
[ Middleware ]        → valida el body (Zod) antes de continuar
    ↓
[ Controller ]        → extrae datos del request, llama al Service
    ↓
[ Service ]           → contiene la lógica de negocio, usa el Repository
    ↓
[ Repository ]        → acceso a datos (stub en memoria en esta iteración)
    ↓
[ Controller ]        → formatea la respuesta usando un DTO
    ↓
Response HTTP
```

---

## 🔄 Patrón DTO

Los DTOs son funciones puras que transforman un objeto del dominio en una representación segura para el cliente, **ocultando datos sensibles** como el `restauranteId` interno.

```js
// Sin DTO ❌ — expone datos internos
res.json(mesa);
// → { _id, numero, capacidad, ubicacion, estado, restauranteId, __v }

// Con DTO ✅ — solo lo necesario
res.json(MesasREST(mesa));
// → { id, numero, capacidad, ubicacion, estado }
```

---

## ✅ Endpoints disponibles

### Menú
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/menu` | Lista los platos (con filtros por query) |
| `POST` | `/api/menu` | Agrega un nuevo plato |
| `PUT` | `/api/menu/:id` | Modifica un plato existente |

### Mesas
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/mesas` | Lista todas las mesas |
| `POST` | `/api/mesas` | Crea una nueva mesa |
| `PUT` | `/api/mesas/:id` | Actualiza una mesa |
| `GET` | `/api/mesas/:tableId/pedidos` | Obtiene el pedido activo de una mesa |

### Pedidos (Comandas)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/pedidos` | Crea una comanda para una mesa |
| `GET` | `/api/pedidos/active` | Lista las comandas abiertas |
| `PATCH` | `/api/pedidos/:id/items` | Agrega ítems a una comanda |
| `PATCH` | `/api/pedidos/:id/status` | Actualiza el estado de la comanda o un ítem |

### Reservas
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/reservas` | Lista reservas (con filtros) |
| `GET` | `/api/reservas/disponibilidad` | Consulta mesas disponibles |
| `POST` | `/api/reservas` | Crea una reserva |
| `GET` | `/api/reservas/:id` | Obtiene una reserva por ID |
| `PUT` | `/api/reservas/:id` | Actualiza una reserva |
| `PUT` | `/api/reservas/:id/confirmar` | Confirma una reserva |
| `PUT` | `/api/reservas/:id/cancelar` | Cancela una reserva |
| `PUT` | `/api/reservas/:id/asistencia` | Registra asistencia o no-show |
| `DELETE` | `/api/reservas/:id` | Elimina una reserva |

---

## 🚀 Cómo correr el servidor

```bash
npm install
npm run dev
```

El servidor levanta en `http://localhost:4000`.

> **Nota sobre los repositorios:** En esta iteración los repositorios son **stubs en memoria** que devuelven datos vacíos o ficticios. La conexión real a la base de datos se implementará en la **Iteración 3**.

---

## 📌 Decisiones de diseño

- **`req.restauranteId`** lo inyecta el middleware `authenticate` al decodificar el token. Todos los controllers lo leen de `req.restauranteId` con una interfaz unificada.
- **`ReservasService` recibe `mesasRepository` por constructor** en lugar de importar `MesaModel` directamente. Esto lo desacopla de la base de datos.

---

## 🔐 Bonus: Autenticación y Autorización JWT

### Flujo de autenticación

```
POST /api/auth/login
  → UserService.login() verifica email + bcrypt.compare(password)
  → Genera JWT con { id, tipo, restauranteId }
  → Responde con cookie httpOnly + body con datos del usuario

Requests siguientes:
  → authenticate() lee la cookie (o header Authorization)
  → jwt.verify() decodifica el token y popula req.user y req.restauranteId
  → requireRole() verifica que req.user.tipo esté en la lista permitida
```

### Roles y permisos

| Rol | Puede hacer |
|-----|-------------|
| `ADMIN` | Todo: crear mesas, platos, usuarios, eliminar reservas |
| `MOZO` | Ver y actualizar mesas, crear/gestionar pedidos y reservas |
| `COCINERO` | Ver pedidos activos y actualizar estado de ítems |

### Nuevos endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | ❌ Público | Inicia sesión y devuelve token |
| `GET` | `/api/auth/me` | ✅ JWT | Devuelve el usuario autenticado |
| `POST` | `/api/auth/logout` | ✅ JWT | Limpia la cookie de sesión |
| `POST` | `/api/users` | ✅ ADMIN | Crea un nuevo usuario |
| `GET` | `/api/users` | ✅ ADMIN | Lista todos los usuarios |
| `PUT` | `/api/users/:id` | ✅ ADMIN | Actualiza un usuario |
| `DELETE` | `/api/users/:id` | ✅ ADMIN | Elimina un usuario |

### Variables de entorno requeridas

Crear un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
# Editar .env y setear un JWT_SECRET seguro
```

```
PORT=4000
JWT_SECRET=tu_secreto_super_seguro_aqui
NODE_ENV=development
DB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/restomaster
```

---

## 🗄️ Iteración 3: Persistencia de Datos

### Nuevos archivos

```
src/
├── schemas/
│   ├── MesaSchema.js         → Mongoose Schema + Model para Mesa
│   ├── ProductoSchema.js     → Mongoose Schema + Model para Producto
│   ├── ComandaSchema.js      → Mongoose Schema + Model para Comanda
│   ├── ItemComandaSchema.js  → Subdocumento embebido en Comanda
│   ├── ReservaSchema.js      → Mongoose Schema + Model para Reserva
│   └── UsuarioSchema.js      → Mongoose Schema + Model para Usuario
├── repositories/
│   ├── MesasRepository.js
│   ├── MenuRepository.js
│   ├── PedidosRepository.js
│   ├── ReservasRepository.js
│   └── UserRepository.js
└── app/
    └── db.js                 → Conexión a MongoDB con Mongoose
```

### `loadClass()`: el puente entre dominio y BD

Cada schema usa `loadClass()` para vincular la clase de dominio de la Iteración 1. De esta forma, los documentos que devuelve MongoDB son instancias que también tienen los métodos de la clase (ej: `calcularTotal()`, `cerrarComanda()`):

```js
ComandaSchema.loadClass(Comanda);

// Ahora un documento de BD tiene los métodos del dominio:
const comanda = await ComandaModel.findById(id);
const total = comanda.calcularTotal(); // ✅ funciona
```

### Subdocumentos vs. Referencias

| Entidad | Estrategia | Razón |
|---------|------------|--------|
| `ItemComanda` dentro de `Comanda` | **Subdocumento embebido** | Los ítems no existen sin la comanda, siempre se consultan juntos |
| `mesa` en `Comanda` | **Referencia** (`ObjectId`) | La mesa existe independientemente, se popula cuando es necesario |
| `mesaReservada` en `Reserva` | **Referencia** (`ObjectId`) | Ídem |
| `mozo` en `Comanda` | **Referencia** (`ObjectId`) | El usuario existe independientemente |

### Soft Delete en Reservas

Las reservas no se eliminan físicamente. En cambio se setea el campo `deletedAt` con la fecha de eliminación. Todas las consultas usan el filtro base `{ deletedAt: null }` automáticamente:

```js
// En lugar de borrar:
await ReservaModel.findByIdAndDelete(id)

// Se marca como eliminada:
await ReservaModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() })
```

### Configuración

Agregar `DB_URI` al archivo `.env`:

```
DB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/restomaster
```

El servidor no arranca si la conexión a MongoDB falla.
# RestoMaster — Iteración 2: Exposición de APIs, Servicios y DTOs

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
│   └── ReservasService.js    → Lógica de negocio para reservas
├── controllers/
│   ├── MesasController.js    → HTTP handlers para /api/mesas
│   ├── MenuController.js     → HTTP handlers para /api/menu
│   ├── PedidosController.js  → HTTP handlers para /api/pedidos
│   └── ReservasController.js → HTTP handlers para /api/reservas
├── routes/
│   ├── MesasRoutes.js
│   ├── MenuRoutes.js
│   ├── PedidosRoutes.js
│   └── ReservasRoutes.js
├── dtos/
│   ├── MesasDTO.js           → Filtra qué campos de Mesa se exponen
│   ├── PlatoDTO.js           → Filtra qué campos de Producto se exponen
│   └── ReservaDTO.js         → Filtra qué campos de Reserva se exponen
├── middlewares/
│   ├── errorHandler.js       → Captura todos los errores de la app y responde en JSON
│   └── validator.js          → Valida el body de un request con un schema Zod
├── validations/
│   ├── mesaSchema.js
│   ├── productoSchema.js
│   ├── reservaSchema.js
│   ├── comandaSchema.js
│   └── itemComandaSchema.js
└── app/
    └── context.js            → Ensambla los objetos (repositorios → servicios → controladores)

index.js                      → Punto de entrada del servidor Express
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

- **`req.restauranteId`** en lugar de `req.user.restauranteId`: en esta iteración el `restauranteId` se inyecta mediante un middleware temporal en `index.js`. Cuando se implemente la autenticación JWT (Bonus), ese middleware será reemplazado por one que decodifique el token.
- **`ReservasService` recibe `mesasRepository` por constructor** en lugar de importar `MesaModel` directamente. Esto mantiene el servicio desacoplado de la base de datos.
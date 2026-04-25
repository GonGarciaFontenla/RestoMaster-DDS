# RestoMaster — Explicación y Fundamentación Técnica · Entrega 2

En esta segunda iteración de RestoMaster transformamos la lógica de dominio construida en la Entrega 1 en una API REST completamente funcional y consumible por sistemas externos. A continuación, detallamos paso a paso las decisiones de diseño implementadas y su justificación técnica.

---

## 1. Separación de Responsabilidades (SoC) y Arquitectura en Capas

Para mantener el código organizado, testeable y escalable, dividimos la aplicación en capas bien diferenciadas:

- **Rutas (`src/routes/`)**: Definen los endpoints (URL + verbo HTTP) que expone la aplicación y aplican los middlewares de validación. Su única responsabilidad es dirigir el tráfico al controlador correcto.
- **Controladores (`src/controllers/`)**: Adaptan la petición HTTP cruda (`req` y `res`). Extraen parámetros, invocan la capa de servicios y construyen la respuesta JSON con el código de estado correcto (ej: `200 OK`, `201 Created`).
- **Servicios (`src/services/`)**: Contienen el verdadero núcleo de la lógica de negocio. Son **agnósticos al protocolo HTTP**: retornan datos puros o lanzan excepciones de dominio. No saben nada de `req` ni de `res`.

**Justificación:** Esta separación evita el anti-patrón de *Fat Controller* (Controladores Gordos), donde la lógica HTTP y las reglas de negocio coexisten y se acoplan, haciendo el código imposible de testear por separado. Al ser los servicios independientes del protocolo, una migración futura de Express a gRPC, GraphQL o WebSockets dejaría la lógica de negocio completamente intacta (**Principio Abierto/Cerrado**).

---

## 2. Servicios Robustos: Casos de Uso Implementados

Centralizamos las reglas de la aplicación en los siguientes flujos principales:

### Gestión de Mesas y Pedidos (Comandas)
A través de `PedidosService` y `MesasService`, garantizamos que la vida de una comanda fluya sin errores:

1. **Creación**: Cuando se crea un pedido para una mesa, el servicio valida estrictamente que la mesa exista y comprueba que **no tenga otra comanda abierta activa**.
2. **Agregar Ítems**: El servicio busca los precios actualizados de los productos en el menú y arma los ítems, garantizando que todo empiece en estado `PENDIENTE` para la cocina.
3. **Control de Estado**: Para cerrar una comanda, el sistema delega la validación al objeto de dominio `Comanda.cerrarComanda()`, que lanza un `BusinessRuleError` si detecta ítems aún `EN_COCINA`. De esta forma, la regla de negocio vive en un único lugar (**principio DRY**).

### Gestión de Reservas
A través de `ReservasService`, expusimos el flujo de agenda de los clientes:

- **Disponibilidad y Creación**: Se valida que la mesa tenga *capacidad adecuada* para la cantidad de comensales y que el horario solicitado no colisione con una reserva ya existente.
- **Máquina de Estados**: El servicio implementa métodos explícitos para confirmar (`CONFIRMADA`), cancelar (`CANCELADA`) y registrar el resultado (`ASISTIO` o `NO_SHOW`), bloqueando transiciones ilógicas (ej: no se puede cancelar una reserva que ya ocurrió).

---

## 3. Principio Fail-Fast y Validaciones como Cross-Cutting Concern (Zod + Middlewares)

No podemos confiar ciegamente en lo que envía el cliente. Implementamos un sistema de **validación de esquemas con Zod** (`src/validations/`) que se acopla como middleware en las rutas. Ejemplos de lo que interceptamos:

- Un cliente intenta crear una reserva sin `nombreCliente` o con `telefono` vacío.
- El frontend envía texto en el campo `horario` en lugar de una fecha ISO válida.
- Se envía una `cantidadComensales` negativa.
- Se envía un ID de mesa o producto con formato inválido.

El middleware responde con **HTTP 400 Bad Request** detallando exactamente qué campo falló, sin siquiera invocar al controlador o al servicio.

**Justificación:** Al validar con Zod en el borde de la aplicación, aplicamos el principio **Fail-Fast** (falla rápido): los errores de formato se abortan en la periferia, protegiendo el núcleo de procesar datos basura. Centralizar la validación la trata como un **Cross-Cutting Concern** (Preocupación Transversal), eliminando la lógica condicional repetitiva (`if (!req.body.campo) return res.status(400)...`) en los controladores y respetando el principio de Responsabilidad Única (**SRP**).

---

## 4. Patrón DTO (Data Transfer Object) como Capa Anticorrupción

Los documentos de Mongoose incluyen campos de infraestructura (`__v`, `restauranteId`) y referencias internas que no le importan al consumidor de la API. Para limpiar esto, implementamos el patrón **DTO** mediante funciones adaptadoras (ej: `PlatoREST` en `src/dtos/PlatoDTO.js`).

Cuando un controlador necesita devolver un plato y responde con `PlatoREST(plato)`, logramos:

1. **Ocultar información**: Omitimos campos de bajo nivel irrelevantes para el cliente.
2. **Estandarizar formatos**: Mapeamos `_id` a `id`, con un nombre limpio y predecible.
3. **Proteger el contrato público**: Si el día de mañana se modifica el esquema de la base de datos, el DTO actúa como escudo amortiguador; los clientes web o móviles no verán su código romperse.

**Justificación:** El DTO actúa como una *Anti-Corruption Layer* hacia el exterior. Al desacoplar el modelo interno de la API pública, respetamos el **Principio de Ocultamiento de Información**: el esquema interno puede evolucionar iterativamente sin romper el *API Contract* que consumen los clientes.

---

## 5. API RESTful y Diseño Orientado a Recursos

Exponemos endpoints semánticos basados en entidades (`/api/pedidos`, `/api/reservas`, `/api/menu`), usando los verbos HTTP de forma estandarizada:

| Verbo | Semántica |
|-------|-----------|
| `GET` | Lectura de recursos (idempotente) |
| `POST` | Creación de un nuevo recurso |
| `PATCH` | Actualización parcial de un recurso existente |
| `PUT` | Actualización completa o transición de estado explícita |
| `DELETE` | Eliminación de un recurso |

**Justificación:** La arquitectura RESTful aplica los verbos del protocolo HTTP sobre sustantivos que representan recursos. Esto sigue los principios de una **Interfaz Uniforme**, facilitando la predictibilidad, la cacheabilidad de las respuestas y la escalabilidad del sistema sin estado (*stateless*).

### Endpoints disponibles

| Verbo | Endpoint | Descripción |
|-------|----------|-------------|
| `GET` | `/api/menu` | Listar productos del menú |
| `POST` | `/api/menu` | Agregar un producto |
| `PATCH` | `/api/menu/:id` | Modificar un producto |
| `GET` | `/api/mesas` | Listar mesas |
| `POST` | `/api/mesas` | Crear mesa |
| `PATCH` | `/api/mesas/:id` | Actualizar mesa |
| `GET` | `/api/mesas/:id/pedidos` | Ver comanda activa de una mesa |
| `POST` | `/api/pedidos` | Abrir comanda |
| `PATCH` | `/api/pedidos/:id/items` | Agregar ítems a la comanda |
| `PATCH` | `/api/pedidos/:id/status` | Actualizar estado de comanda o ítem |
| `GET` | `/api/reservas` | Listar reservas |
| `GET` | `/api/reservas/disponibilidad` | Consultar mesas disponibles |
| `POST` | `/api/reservas` | Crear reserva |
| `GET` | `/api/reservas/:id` | Obtener reserva por ID |
| `PUT` | `/api/reservas/:id` | Actualizar datos de una reserva |
| `PUT` | `/api/reservas/:id/confirmar` | Confirmar reserva |
| `PUT` | `/api/reservas/:id/cancelar` | Cancelar reserva |
| `PUT` | `/api/reservas/:id/asistencia` | Registrar asistencia (`ASISTIO` / `NO_SHOW`) |
| `DELETE` | `/api/reservas/:id` | Eliminar reserva |

---

## 6. (Bonus) Autenticación y Autorización Desacopladas (JWT + Middlewares)

La autenticación basada en **JWT (JSON Web Token)** se implementa como middleware, verificando la identidad del usuario antes de que cualquier controlador o servicio despierte.

**Justificación:** Al implementar la autenticación vía middlewares, aplicamos el patrón **AOP (Programación Orientada a Aspectos)**. Los servicios asumen que el usuario subyacente ya está autenticado y autorizado, delegando completamente esta validación al middleware de JWT. Esto mantiene la lógica de negocio libre de comprobaciones de seguridad reiterativas, adhiriendo nuevamente al principio **SRP**.

---

> **Para explorar el proyecto:** revisá los endpoints en `src/routes/` y probá las llamadas con un cliente HTTP como [Postman](https://www.postman.com/) o [Hoppscotch](https://hoppscotch.io/).

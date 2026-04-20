# RestoMaster - Resolución Entrega 2: Exposición de APIs, Servicios y DTOs

¡Bienvenidos a la resolución de la segunda iteración de RestoMaster! En esta etapa, el objetivo principal fue transformar nuestra lógica de dominio en una aplicación completamente utilizable por sistemas externos. Para lograrlo, construimos una sólida arquitectura basada en el estilo arquitectónico **REST**. 

A continuación, detallamos paso a paso las decisiones de diseño y las implementaciones llevadas a cabo en esta entrega para cumplir con los requerimientos de nuestro Tech Leader.

---

## 1. Arquitectura en Capas: Separación de Responsabilidades

Para mantener el código organizado, testeable y escalable, dividimos la interacción en capas clave:

- **Rutas (`src/routes/`)**: Definen las URLs (endpoints) que expone nuestra aplicación y qué verbo HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) deben escuchar. Su única responsabilidad es dirigir el tráfico al lugar correcto.
- **Controladores (`src/controllers/`)**: Son los encargados de recibir la petición cruda HTTP (`req` y `res`). Extraen los parámetros, invocan a la capa de servicios y deciden qué código de estado HTTP (ej. 200 OK, 201 Created) y estructura JSON enviar de regreso.
- **Servicios (`src/services/`)**: Aquí es donde vive el **verdadero corazón de nuestra lógica de negocio**. Los servicios contienen las reglas que hacen que RestoMaster funcione como debe funcionar, validando estados y tomando decisiones antes de hablar con la base de datos (repositorios).

---

## 2. Servicios Robustos: Casos de Uso Implementados

Centralizamos las reglas de nuestra aplicación en los siguientes flujos principales:

### Gestión de Mesas y Pedidos (Comandas)
A través de `PedidosService` y `MesasService`, garantizamos que la vida de una comanda fluya sin errores:
1. **Creación**: Cuando se crea un pedido para una mesa, el servicio valida estrictamente que la mesa exista y comprueba tempranamente que **no tenga otra comanda abierta activa**.
2. **Agregar Ítems**: Se reciben los productos solicitados. El servicio busca los precios actualizados y arma los ítems, garantizando que todo empiece en un estado "PENDIENTE" para la cocina.
3. **Control de Estado**: ¿Quieren cerrar una cuenta? El sistema nos frena inmediatamente si descubre que hay algún plato todavía en preparación (`EN_COCINA`), lanzando un `BusinessRuleError`.

### Gestión de Reservas
A través de `ReservasService`, expusimos el flujo de agenda de los clientes:
- **Disponibilidad y Creación**: Calculamos márgenes de tiempo (`±30 minutos`) para evitar solapamientos de reservas. También validamos de forma implacable que una mesa tenga la _capacidad adecuada_ para la cantidad de comensales enviados.
- **Máquina de Estados de Asistencia**: Incorporamos métodos que facilitan confirmar (`CONFIRMADA`), cancelar o registrar el final del proceso (`ASISTIO` o `NO_SHOW`), bloqueando transiciones ilógicas (ej: no se puede cancelar algo que ya pasó).

---

## 3. Seguridad Perimetral: Validaciones (Zod)

Para garantizar la estabilidad del sistema, sabemos que no podemos confiar ciegamente en lo que se envía desde el cliente.

Implementamos un sistema de **validación de esquemas utilizando Zod** dentro de la carpeta `src/validations/`. Estos esquemas se acoplan como _middlewares_ en el ruteo. ¿Qué significa esto?
- Si un cliente intenta reservar sin enviar el `nombreCliente` o si manda un `telefono` vacío.
- Si el _frontend_ manda texto en el campo `horario` en lugar de una fecha válida ISO.
- O si envían una `cantidadComensales` negativa.

El _middleware_ intercepta la petición y responde automáticamente con un error **HTTP 400 Bad Request** detallando exactamente qué campo falló, sin siquiera despertar a nuestros Controladores o Servicios.

---

## 4. Patrón DTO (Data Transfer Objects)

El Tech Leader fue muy claro: no debemos exponer datos innecesarios a internet.

Internamente, nuestros documentos de base de datos (`mongoose`) incluyen `_id`, variables de fecha `_V`, datos internos del motor y potencialmente ids de asociación a otras lógicas (como `restauranteId` o contraseñas enmascaradas). 
Para limpiar esto, implementamos el patrón **DTO** utilizando funciones adaptadoras (por ejemplo, `PlatoREST` en `src/dtos/PlatoDTO.js`).

Cuando un Controller necesita devolver un Plato y responde con `PlatoREST(plato)`, logramos:
1. **Ocultar información**: Omitimos propiedades de bajo nivel que no le importan al que consume la API.
2. **Estandarizar formatos**: Cambiamos nombres internos extraños por claves amigables (como `_id` mapeado limpiamente a `id`).
3. **Proteger cambios**: Si el día de mañana modificamos nuestra base de datos, nuestro DTO nos servirá como escudo amortiguador, por lo cual los clientes móviles o web que nos consuman no se van a enterar de nuestra refactorización ni verán su código romperse.

---

## Resumen de Endpoints Disponibles
A esta altura de la entrega, nuestra API quedó moldeada con verbos descriptivos sobre colecciones lógicas, por ejemplo:
- `GET /api/menu` (Listar productos)
- `POST /api/pedidos` (Abrir cuenta)
- `PATCH /api/pedidos/:id/items` (Añadir productos a cuenta)
- `POST /api/reservas` (Crear reserva)

¡Los invitamos a explorar el código del proyecto, leer los endpoints en la carpeta `src/routes/` y realizar sus propias pruebas usandos clientes HTTP (como Postman u Hoppscotch)!

# Fundamentación Técnica y Arquitectónica - Entrega 2

Tras analizar el archivo explicativo de esta iteración (`ExplicacionReso.md`), se observa que realiza una buena descripción práctica del flujo de datos, el patrón DTO y el enrutamiento. Sin embargo, para cumplir con los estándares de diseño de un **Arquitecto de Software Senior**, es necesario profundizar en las justificaciones teóricas que avalan estas decisiones.

A continuación, presento la fundamentación rigurosa de las decisiones de diseño implementadas en la Entrega 2:

## 1. Separation of Concerns (SoC) y Arquitectura en Capas

El proyecto separa explícitamente Rutas, Controladores y Servicios. 
* **Justificación:** Esta división evita el anti-patrón de *Fat Controller* (Controladores Gordos) donde la lógica HTTP y las reglas de negocio coexisten y se acoplan. 
    * **Capa de Presentación (Controllers/Routes):** Su única responsabilidad es actuar como adaptadores de entrada términales (manejo de `req` y `res`, serialización JSON y subyacentes de Express).
    * **Capa de Lógica (Services):** Son agnósticos al protocolo HTTP. Retornan datos puros o lanzan excepciones de dominio. Esto garantiza que si el día de mañana se decide migrar de Express a gRPC, GraphQL o WebSockets, la lógica de los servicios se mantendrá intacta (**Principio Abierto/Cerrado**).

## 2. Abstracción y Protección del Dominio (Patrón DTO)

El uso del Patrón *Data Transfer Object* (DTO) no es solo una cuestión de seguridad visual, sino de diseño estructural estricto.
* **Justificación:** El DTO actúa como una barrera que desacopla el Modelo de Dominio (las entidades que reflejan la base de datos o el modelo rico) de la API pública. Al utilizar DTOs, respetamos el **Principio de Ocultamiento de Información** y construimos una especie de *Anti-Corruption Layer* (Capa Anticorrupción) hacia el exterior: la base de datos puede sufrir cambios iterativos en su esquema interno sin romper el contrato público (API Contract) que consumen los clientes móviles o web.

## 3. Principio Fail-Fast y Cross-Cutting Concerns (Zod + Middlewares)

Las validaciones de esquema no se realizan ad-hoc dentro de cada controlador, sino mediante middlewares en las rutas.
* **Justificación:** Al validar el payload asertivamente con Zod antes de que el controlador despierte, estamos aplicando el principio **Fail-Fast** (falla rápido). Los errores sintácticos o de formato se abortan en la periferia de la aplicación, protegiendo al núcleo (Servicios) de procesar datos basura. Además, esto centraliza la validación tratándola como un **Cross-Cutting Concern** (Preocupación Transversal), lo que favorece el principio SRP y elimina la lógica condicional repetitiva (`if (!req.body.name) return res.status(400)...`) en los controladores.

## 4. API RESTful y Diseño Orientado a Recursos

Se exponen endpoints semánticos basados en entidades (ej. `/api/pedidos`, `/api/reservas`).
* **Justificación:** La arquitectura RESTful utiliza los verbos del protocolo HTTP de forma estandarizada e *Idempotente* (como `PUT` o `DELETE`) aplicados sobre sustantivos que representan los recursos. Esto sigue los principios de una **Interfaz Uniforme**, facilitando la predictibilidad, la cacheabilidad de las respuestas y la escalabilidad del sistema sin estado (stateless).

## 5. (Bonus) Autenticación y Autorización Desacopladas

Si se opta por el uso de JWT, su implementación vía middlewares asegura un control de acceso de tipo **AOP (Programación Orientada a Aspectos)**.
* **Justificación:** El servicio de reservas o pedidos asume que el usuario subyacente ya está autorizado y posee credenciales válidas, delegando esta validación al middleware de JWT. Esto mantiene la Lógica de Negocio pura y libre de comprobaciones de seguridad reiterativas, adhiriendo nuevamente al principio SRP.

# RestoMaster — Iteración 1: Modelo de Objetos y Dominio

## 🎯 Objetivo de esta iteración

En esta primera entrega implementamos el **núcleo del sistema**: las clases que representan el dominio del restaurante, con su lógica de negocio y jerarquía de errores personalizados. **No hay servidor, no hay base de datos, no hay rutas HTTP** — solo clases JavaScript puras.

---

## 📁 Estructura de archivos

```
iteracion-1/
├── package.json
├── src/
│   ├── domain/
│   │   ├── enums/
│   │   │   ├── CategoriaPlato.js   → Categorías del menú
│   │   │   ├── EstadoCocina.js     → Estados de un ítem en cocina
│   │   │   ├── EstadoComanda.js    → Estados de una comanda
│   │   │   ├── EstadoMesa.js       → Estados de una mesa
│   │   │   ├── EstadoReserva.js    → Estados de una reserva
│   │   │   ├── TipoUsuario.js      → Roles de los usuarios
│   │   │   └── Ubicacion.js        → Sectores del restaurante
│   │   ├── Comanda.js              → Lógica de comanda + cerrarComanda()
│   │   ├── ItemComanda.js          → Ítem de comanda + precioTotal()
│   │   ├── Mesa.js                 → Clase Mesa
│   │   ├── Producto.js             → Clase Producto
│   │   ├── Reserva.js              → Clase Reserva
│   │   └── Usuario.js              → Clase Usuario
│   └── errors/
│       ├── AppError.js             → Clase base de errores
│       ├── BusinessError.js        → Error de regla de negocio
│       ├── AuthError.js            → Error de credenciales
│       └── GeneralErrors.js        → NotFoundError, ExistentResource, NonExistentResource
└── tests/
    └── comanda.test.js             → Tests de lógica de Comanda
```

---

## 🏗️ Clases del Dominio

### `Mesa`
Representa una mesa física del restaurante.
- **Estado por defecto:** `EstadoMesa.LIBRE`

### `Producto`
Representa un plato o bebida del menú.
- **Valores por defecto:** `vegetariano = false`, `celiaco = false`

### `Reserva`
Reserva de una mesa a nombre de un cliente.
- **Estado por defecto:** `EstadoReserva.PENDIENTE`

### `Usuario`
Usuario del sistema (mozo, admin, cocinero).

### `ItemComanda`
Un ítem dentro de una comanda (producto + cantidad + precio).
- **Estado por defecto:** `EstadoCocina.PENDIENTE`
- **Lógica:** `precioTotal()` devuelve `precioUnitario * cantidad`

### `Comanda`
Agrupador de ítems para una mesa, manejado por un mozo.
- **Estado por defecto:** `EstadoComanda.ABIERTA`
- **Lógica 1:** `calcularTotal()` suma los `precioTotal()` de todos sus ítems
- **Lógica 2:** `cerrarComanda()` lanza `BusinessRuleError` si algún ítem está en `EN_COCINA`

---

## 🔴 Jerarquía de Errores

```
Error (nativo de JS)
└── AppError                  → Base: statusCode + isOperational
    ├── BusinessRuleError     → 400 · Violación de regla de negocio
    ├── CredencialesInvalidas → 401 · Login fallido
    ├── NotFoundError         → 404 · Recurso no encontrado
    ├── ExistentResource      → 400 · Recurso duplicado
    └── NonExistentResource   → 400 · Recurso inexistente
```

> 💡 **¿Por qué una jerarquía?** Porque en iteraciones futuras el servidor Express necesitará capturar los errores y enviar la respuesta HTTP correcta. Al tener el `statusCode` dentro del error, el middleware de manejo de errores puede hacer su trabajo sin depender de condicionales para cada tipo.

---

## 🔵 Enumeraciones

Todos los enums usan `Object.freeze()` para garantizar **inmutabilidad**: una vez definidos, sus valores no pueden modificarse.

```js
// Correcto ✅
import { EstadoMesa } from "./enums/EstadoMesa.js";
console.log(EstadoMesa.LIBRE); // "LIBRE"

// Esto NO tiene efecto gracias a freeze ✅
EstadoMesa.LIBRE = "modificado"; // silenciosamente ignorado
```

---

## ✅ Tests

Los tests validan la lógica de negocio de `Comanda` sin necesidad de servidor ni base de datos.

```bash
npm install
npm test
```

### Casos cubiertos
- `calcularTotal()` con 0 ítems → `0`
- `calcularTotal()` con 1 ítem → precio correcto
- `calcularTotal()` con múltiples ítems → suma correcta
- `cerrarComanda()` sin ítems en cocina → éxito
- `cerrarComanda()` con ítem `SERVIDO` → éxito
- `cerrarComanda()` con ítem `EN_COCINA` → lanza `BusinessRuleError`
- Verificación del mensaje de error
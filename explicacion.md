## RestoMaster - Resolución Entrega 3: Persistencia de Datos

En nuestra tercera iteración logramos un hito fundamental para la aplicación: asegurar que toda la información que nuestro negocio genera sea persistente en el tiempo. Para esto, adoptamos **MongoDB**, una robusta base de datos documental (NoSQL), y la vinculamos a Node.js mediante el excelente ODM (Object Data Modeling) **Mongoose**.

A continuación explicamos los principios rectores bajo los que modelamos este acceso a datos:

### 1. Modelado Avanzado con Schemas (Mongoose)

Los esquemas (Schemas) dictaminan estrictamente cuál es "la forma" aceptable de los datos antes de permitir su ingreso a la base de datos.
Configuramos estos esquemas dentro de `src/schemas/` aprovechando las potentes herramientas del framework:

- Establecimos reglas severas como **`required: true`** para todo dato esencial.
- Definimos **valores por defecto** (por ejemplo, `default: Date.now` para el inicio de una comanda o `default: EstadoComanda.ABIERTA`).
- Protegimos los flujos de estados mapeándolos uno a uno con nuestros _Enums_ de capa de dominio (ej. `enum: Object.values(EstadoComanda)`).

#### Subdocumentos

Tal como pedía el desafío, modelamos esquemas acoplados donde la arquitectura documental lo requería. El caso de éxito perfecto es el de `ItemComanda`. En lugar de forzar relaciones SQL, declaramos a `items: [ItemComandaSchema]` directamente incrustado dentro de `ComandaSchema`. Esto nos da lecturas instantáneas de la nota de pedido completa sin complejos chequeos cruzados.

### 2. Vistiendo la Base de Datos con Lógica de Dominio

Uno de los riesgos de integrar frameworks de persistencia es terminar perdiendo el "Norte" natural que tenían nuestras Clases puras creadas en la primera iteración.
Para evitar la anemia del modelo (es decir, volver a los objetos de base de datos meros portadores de `strings` y `numbers`), **vinculamos directamente las clases del Dominio contra los Modelos de Mongoose**.

Esto se aprecia en sentencias como:
`ComandaSchema.loadClass(Comanda);`

De este modo los registros obtenidos de la base de datos retornan empoderados: ¡se traen consigo todos los cálculos matemáticos o validaciones lógicas que hayamos definido originariamente en nuestra clase del dominio!

### 3. Patrón Repository: Separando Mongoose de los Servicios

Mongoose es excelente, pero tener comandos acoplados a MongoDB desparramados en nuestros _Controllers_ o _Servicios_ es una pésima práctica arquitectónica.
Para resolverlo, implementamos el **Patrón Repository** creando la carpeta `src/repositories/`.

- **Encapsulación**: Cada repositorio (ej. `PedidosRepository.js`) es el único que importa a su respectivo `Model` de base de datos.
- Nuestros _Servicios_ dictan las reglas del negocio, pero cuando precisan guardar algo o buscar "todas las comandas abiertas", lo hacen invocando una función semántica en el Repositorio (ej: `this.pedidosRepository.findActivos()`).
- **Abstracción Total**: ¡El Servicio no tiene la menor idea de si la base de datos es MongoDB, SQL o un .txt! Esta capa nos otorga enorme facilidad de testeo y flexibilidad ante cambios futuros en infraestructura.

### 4. Conexión a la Base de Datos

Finalmente, configuramos un túnel de comunicación constante implementado en `src/app/db.js` ejecutado al encender `index.js`, que gestiona nuestra conexión al clúster leyendo la cadena de texto URI camuflada en un archivo oculto `.env`, resguardando por completo nuestras credenciales reales del control de versiones (Git).

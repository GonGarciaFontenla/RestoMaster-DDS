## 1. Modelo de Dominio Rico vs Modelo Anémico (Patrones GRASP)

En lugar de utilizar estructuras de datos pasivas (un _Modelo de Dominio Anémico_) y delegar las reglas matemáticas a un servicio externo, se ha implementado un **Modelo de Dominio Rico**.

- **Information Expert (Experto en Información):** La responsabilidad de calcular el precio total recae en `ItemComanda` porque es esta clase quien posee la información necesaria (cantidad y precio unitario). De igual forma, `Comanda` itera sobre sus ítems y le pide a cada uno su total en lugar de extraer sus valores para multiplicarlos por fuera. Esto respeta el encapsulamiento y asegura que la lógica del cálculo esté centralizada en la entidad dueña de los datos.

## 2. Encapsulamiento de Reglas de Negocio y Tell, Don't Ask

La regla estricta de _"no se puede cerrar una comanda con ítems En Cocina"_ se ubica dentro del método `cerrarComanda()` de la entidad `Comanda` y no en un validador aislado.

- **Justificación:** Al evitar que un controlador o servicio externo pregunte por el estado de los ítems, garantizamos que la `Comanda` sea el guardián de su propia consistencia e invariantes de negocio. Esto respeta el principio **Tell, Don't Ask** (Dile, no preguntes): no consultamos a la comanda su estado para luego modificarla (Setter pasivo), sino que le ordenamos que intente cerrarse, siendo la propia clase la que aplica la regla y lanza el error correspondiente.

## 3. Inversión y Modelado Defensivo con Inmutabilidad (Enumeraciones)

JavaScript no posee soporte nativo para `enum` rigurosos (como Java o C#). Para modelar categorías y estados (ej. `EstadoMesa`, `CategoríaPlato`), se decidió utilizar objetos inyectados con `Object.freeze()`.

- **Justificación:** Esto introduce **Inmutabilidad**, una buena práctica del desarrollo robusto. En un entorno donde las referencias pueden compartirse ampliamente por ser un lenguaje interpretado dinámico, mutar accidentalmente un valor (ej. `EstadoComanda.ABIERTA = "OTRO"`) destruiría la previsibilidad del estado. La inmutabilidad garantiza comportamientos consistentes y seguros frente a los efectos secundarios.

## 4. Polimorfismo y Liskov Substitution en la Jerarquía de Errores

Se implementó una arquitectura de excepciones centralizada mediante herencia de la clase de error nativa para derivar reglas en componentes como `BusinessRuleError`.

- **Justificación:** El uso de herencia estandariza el contrato de error. Al delegar la identificación del problema en tipos de error tipados, evitamos los _Magic Strings_ o estructuras heterogéneas. Es académicamente valioso porque, en fases posteriores donde se conecte Node/Express, habilitará un validador central (Middleware). Gracias al **Polimorfismo**, este middleware podrá recibir cualquier excepción derivada de `AppError` y responder dinámicamente según sus propiedades uniformes (como su `statusCode`), respetando además el **Principio Abierto/Cerrado (OCP)** de SOLID, ya que agregar nuevos errores no obligará a cambiar la lógica de captura global.

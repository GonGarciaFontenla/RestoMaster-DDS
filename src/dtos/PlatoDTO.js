export const PlatoREST = (producto) => ({
  id: producto._id,
  nombre: producto.nombre,
  precio: producto.precio,
  categoria: producto.categoria,
  vegetariano: producto.vegetariano,
  celiaco: producto.celiaco,
  disponible: producto.disponible,
});

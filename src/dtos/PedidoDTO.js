// Fix #9 y #10: se crea un DTO de Pedido para evitar exponer documentos
// Mongoose crudos (con __v, _id anidados en items, etc.) en la respuesta HTTP.
// Todos los controllers usan DTOs excepto PedidosController — esto los unifica.
export const PedidoREST = (comanda) => ({
  id: comanda._id,
  mozo: comanda.mozo,
  mesa: comanda.mesa,
  estado: comanda.estado,
  fechaApertura: comanda.fechaApertura,
  items: comanda.items?.map((item) => ({
    id: item._id,
    producto: item.producto,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
    estado: item.estado,
  })) ?? [],
});

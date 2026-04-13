// Enumeración de estados posibles para un ítem dentro de la cocina
export const EstadoCocina = Object.freeze({
  PENDIENTE: "PENDIENTE",  // El ítem fue pedido pero aún no está siendo preparado
  EN_COCINA: "EN_COCINA",  // El ítem está siendo preparado activamente
  SERVIDO: "SERVIDO",      // El ítem fue entregado al cliente
});

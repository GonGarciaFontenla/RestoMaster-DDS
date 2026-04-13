// Enumeración de estados posibles para una Comanda
export const EstadoComanda = Object.freeze({
  ABIERTA: "ABIERTA",      // La comanda está activa y puede recibir ítems
  CERRADA: "CERRADA",      // La comanda fue finalizada exitosamente
  CANCELADA: "CANCELADA",  // La comanda fue anulada
});

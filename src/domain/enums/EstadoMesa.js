// Enumeración de estados posibles para una Mesa
export const EstadoMesa = Object.freeze({
  LIBRE: "LIBRE",        // La mesa está disponible para ser asignada
  OCUPADA: "OCUPADA",    // La mesa tiene clientes sentados con comanda abierta
  RESERVADA: "RESERVADA",// La mesa tiene una reserva activa
  SUCIA: "SUCIA",        // La mesa fue desocupada y necesita limpieza
});

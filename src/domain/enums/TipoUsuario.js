// Enumeración de roles de usuario en el sistema
export const TipoUsuario = Object.freeze({
  MOZO: "MOZO",         // Puede gestionar mesas, comandas y reservas
  ADMIN: "ADMIN",       // Acceso total: gestión de menú, usuarios y reportes
  COCINERO: "COCINERO", // Puede ver y actualizar el estado de los ítems en cocina
});

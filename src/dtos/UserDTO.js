export const UserREST = (usuario) => ({
  id: usuario._id,
  nombre: usuario.nombre,
  email: usuario.email,
  tipo: usuario.tipo,
});

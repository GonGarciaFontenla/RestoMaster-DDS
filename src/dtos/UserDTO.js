export const UserREST = (usuario) => ({
  id: usuario._id,
  nombre: usuario.name,
  email: usuario.email,
  tipo: usuario.tipo,
});

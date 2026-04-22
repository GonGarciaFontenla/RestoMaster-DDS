// Fix #6: se unifica el nombre expuesto en la respuesta HTTP al mismo que usa
// el schema de Mongoose (name) y el schema Zod (name), eliminando la
// inconsistencia: request recibe "name" pero response devolvía "nombre".
export const UserREST = (usuario) => ({
  id: usuario._id,
  name: usuario.name,
  email: usuario.email,
  tipo: usuario.tipo,
});

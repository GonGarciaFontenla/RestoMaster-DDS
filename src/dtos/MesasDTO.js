export const MesasREST = (mesa) => ({
  id: mesa._id,
  numero: mesa.numero,
  capacidad: mesa.capacidad,
  ubicacion: mesa.ubicacion,
  estado: mesa.estado,
});

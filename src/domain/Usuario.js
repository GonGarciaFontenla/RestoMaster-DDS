import { TipoUsuario } from "./enums/TipoUsuario.js";

export default class Usuario {
  constructor(nombre, email, password, tipo) {
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.tipo = tipo;
  }
}

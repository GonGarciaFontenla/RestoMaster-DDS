import { TipoUsuario } from "./enums/TipoUsuario.js";

export default class Usuario {
  constructor(name, email, tipo) {
    this.name = name;
    this.email = email;
    this.tipo = tipo;
  }
}

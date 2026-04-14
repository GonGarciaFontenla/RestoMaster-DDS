import { TipoUsuario } from "./enums/TipoUsuario.js";

export default class Usuario {
  constructor(name, email, password, tipo) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.tipo = tipo;
  }
}

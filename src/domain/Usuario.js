import { TipoUsuario } from "./enums/TipoUsuario.js";

/**
 * Representa un usuario del sistema RestoMaster.
 *
 * @param {string} name - Nombre completo del usuario.
 * @param {string} email - Email único utilizado para autenticarse.
 * @param {string} password - Contraseña del usuario (debe almacenarse hasheada).
 * @param {TipoUsuario} tipo - Rol del usuario en el sistema (MOZO, ADMIN, COCINERO).
 */
export default class Usuario {
  constructor(name, email, password, tipo) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.tipo = tipo;
  }
}

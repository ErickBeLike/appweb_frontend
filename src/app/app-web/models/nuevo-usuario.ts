export class NuevoUsuario {
    nombreUsuario: string;
    contrasena: string;
    roles: string[];

    constructor(nombreUsuario: string, contrasena: string, roles: string[]) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.roles = roles;
    }
}

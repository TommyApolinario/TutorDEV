//Interfaz con el body requerido para cambiar la contraseña (fuera de la aplicación)
export interface BodyChangePassword {
    token: string;
    password: string;
}

//Interfaz con la respuesta del servicio para cuando se cambia la contraseña (Fuera de la aplicación)
export interface ResponseChangePassword {
    message: string;
    status: string;
}

//Interfaz con el body requerido para cambiar la contraseña (Dentro de la aplicación)
export interface BodyChangePasswordInApp{
    password: string;
}
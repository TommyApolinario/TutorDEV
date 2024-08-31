//Interfaz para ingresar el correo de recuperación
export interface ForgotPasswordI {
    email: string;
}

//Interfaz de respuesta de la API cuando se envía el correo para recuperación
export interface ApiResponseForgotPasswordI{
    message: string;
    status: string;
}
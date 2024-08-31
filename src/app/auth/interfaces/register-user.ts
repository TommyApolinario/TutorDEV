//Interfaz con el body requerido para registrar un usuario
export interface RegisterUserI {
    first_name: string;
    email: string;
    password: string;
    type_user: string;
}

//Interfaz de respuesta de la API cuando se registra un usuario
export interface ApiResponseRegisterUserI{
    data: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        birth_date: string;
        points_earned: number;
        whatsapp: string;
        telegram: string;
        telegram_id: number;
        url_avatar: string;
        status: string;
        type_user: string;
        perfil_update_required: boolean;
    },
    message: string;
    status: string;
}
//Interfaz con el body necesario para actualizar la información de un usuario
export interface UpdateUserProfileI {
    first_name: string;
    last_name: string;
    birth_date: string;
    whatsapp: string;
    telegram: string;
    url_avatar: string;
}

//Interfaz para obtener la información del usuario
export interface ApiResponseGetInfoUserI{
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
}
//Interfaz que devuelve la API para listar todos los usuarios de Unidev
export interface ApiResponseListUsersI {
    id: number
    first_name: string
    last_name: string
    email: string
    birth_date: string
    points_earned: number
    whatsapp: string
    telegram: string
    telegram_id: number
    url_avatar: string
    status: string
    type_user: string
    perfil_update_required: boolean
}

//Interfaz que contiene los datos de un usuario
export interface UserI{
    id: number
    first_name: string
    last_name: string
    email: string
    birth_date: string
    points_earned: number
    whatsapp: string
    telegram: string
    telegram_id: number
    url_avatar: string
    status: string
    type_user: string
    perfil_update_required: boolean
}
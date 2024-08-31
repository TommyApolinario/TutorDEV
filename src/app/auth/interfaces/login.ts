//Interfaz para ingresar credenciales de inicio de sesión
export interface ApiResponseLogin {
    token: string;
    user: UserLoginI;
}

export interface UserLoginI {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    points_earned: number;
    whatsapp: string;
    telegram: string;
    url_avatar: string;
    status: string;
    type_user: string;
}

export interface LoginErrorI{
   error: {
    data: string;
    message: string;
    status: string;
   }
}
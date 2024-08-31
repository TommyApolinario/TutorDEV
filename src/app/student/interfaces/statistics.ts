//Interfaz de respuesta de la api con el top 10 de usuarios con más puntuación
export interface ApiResponseGetTopTenI{
    user_id: number;
    first_name: string;
    last_name: string;
    url_avatar: string;
    points: number;
}
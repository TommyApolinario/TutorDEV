//Interfaz de respuesta de la Api con el array de TODOS los módulos registrados en la aplicación
export interface ApiResponseAllModulesI {
    data: [
        DataAllModulesI
    ],
    details: DetailsPage;
}

//Interfaz con la data de los módulos
export interface DataAllModulesI {
    id: number;
    created_at: string;
    updated_at: string;
    create_by: CreatedByI;
    code: string;
    title: string;
    short_description: string;
    text_root: string;
    img_back_url: string;
    difficulty: string;
    points_to_earn: number;
    index: number;
    is_public: boolean
    is_subscribed: boolean;
}

//Interfaz dentro de la data del módulo que indica quién creó el módulo
export interface CreatedByI{
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
    perfil_update_required: boolean
}

//Interfaz que contiene la información de la paginación
export interface DetailsPage{
    page: number;
    total_page: number;
    total_items: number;
    items_per_page: number;
}

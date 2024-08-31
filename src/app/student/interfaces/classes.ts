import { CreatedByI } from "./modules";

//Interfaz con el body requerido para unirse a una clase
export interface JoinToClassI {
    code: string;
}

//Interfaz de respuesta de la API para cuando un usuario se une a una clase
export interface ApiResponseJoinToClassI {
    id: number;
}

//Interfaz con respuesta de la API que devuelve el listado de clases
export interface ApiResponseListClassesI {
    id: number
    created_by_id: number
    created_by: CreatedByI
    teacher_id: number
    teacher: CreatedByI
    code: string
    name: string
    course: string
    paralelo: string
    academic_period: string
    description: string
    img_back_url: string
    archived: boolean
}

//Interfaz de respuesta de la api para obtener el array de estudiantes que están en una clase
export interface ApiResponseListsStudentsI {
    students: CreatedByI[];
}
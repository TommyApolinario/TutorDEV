import { CreatedByI } from "../../student/interfaces/modules";

//Interfaz de respuesta de la API para obtener el listado de actividades según el ID del módulo
export interface ApiResponseListActivitiesIT {
    data: [
        DetailActivityByModuleIT
    ],
    details: {
        page: number;
        total_page: number;
        total_items: number;
        items_per_page: number;
    }
}

//Interfaz con el detalle de la actividad que se muestra en el array de la interfaz anterior
export interface DetailActivityByModuleIT {
    id: number;
    type_question: string;
    created_by: CreatedByI;
    created_at: string;
    updated_at: string;
    difficulty: string;
    text_root: string;
}


//Interfaz con el body requerido, para registrar preguntas manualmente o con IA
export interface BodyRegisterQuestionIT {
    text_root: string;
    difficulty: number;
    type_question: string;
    options: {
        select_mode: string; //Single o multiple (cuando el type_question sea multi_choice_text)
        text_options: string[];
        text_to_complete: string;
        hind: string;
    },
    correct_answer: {
        true_or_false: boolean;
        text_options: string[];
        text_to_complete: string[];
    }
}

//Interfaz de respuesta de la API para cuando se registra una pregunta manualmente o con IA
export interface ApiResponseRegisterQuestionIT {
    id: number;
    module_id: number;
    text_root: string;
    difficulty: number;
    type_question: string;
    options: {
        select_mode: string; //Single o multiple (cuando el type_question sea multi_choice_text)
        text_options: string[];
        text_to_complete: string;
        hind: string;
    },
    correct_answer_id: number;
    correct_answer: {
        id: number;
        true_or_false: boolean;
        text_options: string[];
        text_to_complete: string[];
    }
}

//Interfaz con el Body Requerido para actualizar una pregunta
export interface BodyUpdateQuestionIT {
    id: number;
    module_id: number;
    text_root: string;
    difficulty: number;
    type_question: string;
    options: {
        select_mode: string; //Single o multiple (cuando el type_question sea multi_choice_text)
        text_options: string[];
        text_to_complete: string;
        hind: string;
    },
    correct_answer_id: number;
    correct_answer: {
        true_or_false: boolean;
        text_options: string[];
        text_to_complete: string[];
    }
}

//Interfaz con el body requerido para generar una pregunta con IA
export interface BodyGenerateQuestionWithIAIT {
    type_question: string;
    context: string;
    model_version: number;
}

//Interfaz de respuesta de la API cuando se genera una pregunta con IA
export interface ApiResponseGenerateQuestionWithIAIT {
    result: {
        id: number;
        text_root: string;
        difficulty: number;
        type_question: string;
        options: {
            select_mode: string;
            text_options: string[];
            text_to_complete: string;
            hind: string;
        },
        correct_answer: {
            id: number;
            true_or_false: boolean
            text_options: string[],
            text_to_complete: string;
        }
    }
}
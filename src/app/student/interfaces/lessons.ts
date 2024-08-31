import { DataAllModulesI } from "./modules";

//Interfaz de respuesta de la API para cuando se obtienen las preguntas de una lección según el móduo seleccionado
export interface ApiResponseGetActivitiesByLessonI {
    id: number;
    created_at: string;
    module_id: number;
    module: DataAllModulesI;
    started: string;
    finished: string;
    qualification: number;
    test_module_question_answers: ActivitiesDetailI[];
}

export interface ActivitiesDetailI {
    question: QuestionI;
    answer_user: AnswerUserI;
}

//Interfaz complementaria  a la interfaz de ApiResponseGetActivitiesByLessonI, la cual contiene la estructura de la pregunta
export interface QuestionI {
    id: number;
    module_id: number;
    text_root: string; //Enunciado de la pregunta
    difficulty: number;
    type_question: string; //Tipo de pregunta (multi_choice, order_words, true_or_false, complete_text)
    options: {
        select_mode: string; //single o multiple
        text_options: [string],
        text_to_complete: string;
        hind: string;
    }
}

//Interfaz complementaria  a la interfaz de ApiResponseGetActivitiesByLessonI, la cual contiene la estructura de la respuestac del usuario
export interface AnswerUserI {
    answer_user_id: number; //Este se debe enviar para validar la respuesta
    test_module_id: number;
    question_id: number;
    answer_id: number;
    answer: AnswerI;
    responded: boolean;
    score: number;
    is_correct: boolean;
    feedback: string;
    chat_issue_id: number;
}

//Interfaz con el body requerido para validar una respuesta
export interface BodyValidateAnswerI {
    true_or_false: boolean;
    text_options: string[];
    text_to_complete: string[];
}

//Interfaz de respuesta de la API para cuando se valida una pregunta
export interface ApiResponseValidateAnswerI {
    answer_user_id: number;
    test_module_id: number;
    question_id: number;
    answer_id: number;
    answer: AnswerI;
    responded: boolean;
    score: number;
    is_correct: boolean;
    feedback: string;
    chat_issue_id: number;
}

export interface AnswerI {
    id: number
    true_or_false: boolean
    text_options: string[]
    text_to_complete: string[]
}

//Interfaz de respuesta de la API para cuando se finaliza una lección
export interface ApiResponseFinishLessonModuleI {
    finish: string;
    qualification: number;
    test_id: number;
}

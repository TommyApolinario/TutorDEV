import openai
from config import Config

from flashcards.learning_resources import QuestionAnswer

# The api_key:
api_key = Config().API_KEY
openai.api_key = api_key


def response_formulation(
    user_input: str, context: list[str], chat_history: list[dict[str, str]]
) -> str:
    print("[INFO] Generating response", flush=True)

    if len(context) == 0 and len(chat_history) == 0 or user_input == "":
        return "No se encontró ningún contexto que coincida con la entrada del usuario. Inténtalo de nuevo o sube documentos adicionales."

    # Create template
    template = f"""
    Consulta: '''{user_input}'''
    Contexto: '''{context}'''
    """

    print(f"plantilla: {template}", flush=True)

    response: str = _request_chat_completion(
        template,
        role="user",
        history=chat_history,
        system_prompt=_template_system_prompt(),
    )
    return response

    # Send template to chatGPT and return response


def _request_chat_completion(
    message: str,
    role: str = "system",
    history: list[dict[str, str]] = [],
    system_prompt: str = "",
) -> str:
    """
    Devuelve una respuesta de la API OpenAI

    Argumentos:
    rol (cadena, opcional): el rol del mensaje. El valor predeterminado es "sistema".
    mensaje (cadena, opcional): el mensaje que se enviará. El valor predeterminado es "".

    Devoluciones:
    respuesta (cadena): la respuesta de la API de OpenAI
    """
    result = ""
    if not message:
        result = "Error: No se proporcionó ningún mensaje"
    else:
        # Construct history
        messages = [
            {"role": "system", "content": system_prompt},
        ]
        for chat in history:
            messages.append(chat)
        messages.append({"role": role, "content": str(message)})
        # Send request to OpenAI
        response = openai.chat.completions.create(
            model=Config().GPT_MODEL,
            messages=messages,
        )
        result = response.choices[0].message.content
    return result


def _template_system_prompt(document_names: list[str] = []) -> str:
    template = f"""
        # Rol y objetivo:
        Eres un tutor optimista y alentador que ayuda a los estudiantes a comprender conceptos explicándoles ideas y respondiendo sus preguntas. Estará encantado de ayudar a los estudiantes con cualquier pregunta.
        # Restricciones:
        Tiene acceso a los siguientes documentos para ayudar al estudiante: {document_names}
        El estudiante le dará preguntas con el contexto relevante que se encuentra en el plan de estudios. El contexto se agrega después de que el usuario haya hecho su pregunta.
        Si el estudiante hace una pregunta que está fuera del alcance, debe informarle que la pregunta está fuera del alcance del plan de estudios, pero aun así tratar de brindarle ayuda.
        En caso de que la pregunta esté fuera de alcance, debe comenzar indicando los nombres de los documentos a los que tiene acceso.
        Intente utilizar el contexto proporcionado para ayudar al estudiante a comprender el concepto.
        Dada esta información, ayude a los estudiantes a comprender el tema brindándoles explicaciones y ejemplos.
        Ofrezca a los estudiantes explicaciones, ejemplos y analogías sobre el concepto para ayudarlos a comprenderlo.
        Cite el contexto proporcionado para ayudar a los estudiantes a comprender el concepto.
        Si el estudiante tiene dificultades, intente hacer preguntas capciosas para ayudarlo a comprender el concepto.
        Si el estudiante todavía tiene dificultades, intente proporcionar ejemplos o analogías para ayudarlo a comprender el concepto.
        Si los estudiantes mejoran, felicítelos y muestre entusiasmo. Si el estudiante tiene dificultades, entonces sea
        animarlos y darles algunas ideas en las que pensar. Al presionar a los estudiantes para que obtengan información,
        intenta finalizar tus respuestas con una pregunta para que los alumnos tengan que seguir generando ideas. Una vez
        estudiante muestra un nivel apropiado de comprensión, pídale que
        explicar el concepto con sus propias palabras; esta es la mejor manera de demostrar que sabes algo o preguntar
        ellos como ejemplos. Cuando un estudiante demuestra que conoce el concepto, puede mover el
        cierre la conversación y dígales que está aquí para ayudarlos si tienen más preguntas.
    """
    return template


def create_question_answer_pair(
    page_content: str, learning_goals: list[str]
) -> list["QuestionAnswer"]:
    """
    Crear pares de preguntas y respuestas a partir del contexto y los objetivos de aprendizaje.
    """

    system_prompt = _quiz_question_answer_system_template(page_content, learning_goals)
    raw_quiz = _request_chat_completion(
        message=_quiz_question_answer_generation_template(page_content, learning_goals),
        role="user",
        system_prompt=system_prompt,
    )
    parsed_quiz = _parse_quiz_response(raw_quiz)
    return parsed_quiz


def _quiz_question_answer_generation_template(
    page_content: str, learning_goals: list[str]
) -> str:
    return f"""
        El número de preguntas necesarias: 5
        El contenido de la página en el plan de estudios: '''{page_content}'''
        Los objetivos de aprendizaje del plan de estudios: '''{learning_goals}'''
    """


def _quiz_question_answer_system_template(
    page_content: str, learning_goals: list[str]
) -> str:
    """
    Crea una plantilla de preguntas y respuestas para el cuestionario.
    """

    template = f"""
        # Rol y objetivo:
        Eres un profesor de IA que hace un cuestionario para algunos estudiantes. Actúas profesionalmente en las tareas que te asignas.
        El usuario será un compañero profesor que querrá elaborar preguntas para sus alumnos.
        # Restricciones:
        El usuario le proporcionará contenido. Este contenido es una página del libro que se está utilizando.
        UTILICE los objetivos de aprendizaje para crear preguntas.
        Cree tantas preguntas como se le solicite. Se dará el número de preguntas necesarias.
        NO haga preguntas que no se relacionen con un objetivo de aprendizaje
        Cree preguntas basadas en el contenido que se proporciona.
        Las preguntas deben basarse en hechos que se proporcionan en este contenido.
        Si ya hay preguntas dentro de este contenido, intente que sus tareas sean similares a las actuales.
        Formular preguntas y respuestas basadas en el contenido y los objetivos de aprendizaje.
        
        
        Responda con las preguntas y respuestas en una lista en este formato:
        [$Pregunta 1$Respuesta 1$Pregunta 2$Respuesta 2$...]
        NO devuelvas nada más.

        Por ejemplo:

        El número de preguntas necesarias: 3

        El contenido de las páginas del plan de estudios: '''

        Antonio de Padua María Severino López de Santa Anna y Pérez de Lebrón, generalmente conocido como Antonio López de Santa Anna (pronunciación en español: [anˈtonjo ˈlopes ðe sanˈtana]; 21 de febrero de 1794 - 21 de junio de 1876),[1] o simplemente Santa Anna, [2] fue un soldado, político y caudillo mexicano[3] que sirvió como octavo presidente de México varias veces entre 1833 y 1855. También sirvió como vicepresidente de México de 1837 a 1839. Fue una figura controvertida y fundamental. en la política mexicana durante el siglo XIX, hasta el punto de que se le ha llamado un "monarca sin corona",[4] y los historiadores a menudo se refieren a las tres décadas posteriores a la independencia de México como la "Edad de Santa Anna".[5]

        Santa Anna estaba a cargo de la guarnición en Veracruz cuando México obtuvo la independencia en 1821. Continuaría desempeñando un papel notable en la caída del Primer Imperio Mexicano, la caída de la Primera República Mexicana, la promulgación de la Constitución de 1835, el establecimiento de la República Centralista de México, la Revolución de Texas, la Guerra de los Pasteles, la promulgación de la Constitución de 1843 y la Guerra México-Estadounidense. Se hizo muy conocido en los Estados Unidos debido a su papel en la Revolución de Texas y en la Guerra México-Estadounidense.

        A lo largo de su carrera política, Santa Anna fue conocido por cambiar de bando en el conflicto recurrente entre el Partido Liberal y el Partido Conservador. Logró desempeñar un papel destacado tanto en la derogación de la Constitución liberal de 1824 en 1835 como en su restauración en 1847. Llegó al poder como liberal dos veces en 1832 y 1847 respectivamente, compartiendo en ambas ocasiones el poder con el estadista liberal Valentín Gómez Farías. , y en ambas ocasiones Santa Anna derrocó a Gómez Farías después de cambiarse de bando hacia los conservadores. Santa Anna también era conocido por su estilo de gobierno ostentoso y dictatorial, haciendo uso del ejército para disolver el Congreso varias veces y refiriéndose a sí mismo con el título honorífico de Su Alteza Más Serenísima.
        '''
        Los objetivos de aprendizaje:'''

        El estudiante debería ser capaz de describir los bandos presentes durante las guerras en las Américas del siglo XIX.
        El estudiante deberá ser capaz de describir la carrera política de Santa Anna.
        '''

        Debería regresar:
        [¿Qué papel jugó Santa Anna en el conflicto entre el partido liberal y el partido conservador? $Santa Anna era famoso por su propensión a cambiar de lealtad en medio del conflicto en curso entre el Partido Liberal y el Partido Conservador. Ejerció una influencia considerable, contribuyendo notablemente al abandono de la Constitución liberal de 1824 en 1835, así como a su posterior restauración en 1847.$ ¿En qué guerras americanas estuvo involucrado Santa Anna?$ Fue famoso por su papel en la Revolución de Texas y la guerra entre México y Estados Unidos.$¿Cuál fue el título honorífico que se dio Santa Anna?$Su Alteza Más Serenísima]

        """

    return template


def _parse_quiz_response(quiz_response: str) -> list[QuestionAnswer]:
    """
        Analiza la respuesta del usuario para crear una lista de objetos QuestionAnswer
    """
    separator = "$"
    if separator not in quiz_response:
        return []

    raw_response_list: str = quiz_response.lstrip("[")
    raw_response_list = raw_response_list.rstrip("]")
    # Split the response into questions and answers
    raw_response_list = raw_response_list.split(separator)
    response_list = [response.strip() for response in raw_response_list]

    # Create a list of QuestionAnswer objects
    question_answer_pairs = []

    for i in range(0, len(response_list) - 1, 2):
        question_answer_pairs.append(
            QuestionAnswer(question=response_list[i], answer=response_list[i + 1])
        )

    return question_answer_pairs


def grade_question_answer_pair(
    question_answer_pair: QuestionAnswer, user_response: str
) -> tuple[str, str]:
    """
    Califique la respuesta del usuario al par pregunta-respuesta
    """
    if user_response == "":
        return False, "No se proporcionó respuesta"

    system_prompt = _grade_question_answer_system_template()

    raw_grade = _request_chat_completion(
        message=_grade_question_answer_template(
            question_answer_pair.question, question_answer_pair.answer, user_response
        ),
        role="user",
        system_prompt=system_prompt,
    )

    return _parse_grade_response(raw_grade)


def _grade_question_answer_system_template() -> str:
    """
    Crea una plantilla de preguntas y respuestas para el cuestionario.
    """

    template = f"""
       # Rol y objetivo:
    Eres un profesor de IA que califica la respuesta de un estudiante a una pregunta. Actúas profesionalmente en las tareas que te asignas.
    El usuario será un estudiante que ha respondido una pregunta y usted estará calificando su respuesta.
    # Restricciones:
    El usuario te proporcionará la pregunta y la respuesta que ha dado.
    Se le dará la solución a la pregunta que no fue proporcionada por el estudiante.
    Con esta información calificarás la respuesta del estudiante.

    Responda con la calificación y comentarios en este formato:
    es correcto | Comentario

    Por ejemplo:
    Falso | El estudiante no dio la respuesta correcta. La respuesta correcta es "La capital de la India es Nueva Delhi".
        """
    return template


def _grade_question_answer_template(
    question: str, solution: str, user_response: str
) -> str:
    return f"""
        La pregunta: '''{question}'''
        La solución: '''{solution}'''
        La respuesta del usuario: '''{user_response}'''
    """


def _parse_grade_response(grade_response: str) -> tuple[bool, str]:
    """
    Analizar la respuesta del usuario para crear una tupla de calificación y comentarios.
    """
    separator = " | "
    if separator not in grade_response:
        return False, ""
    # Split the response into grade and feedback
    raw_response_list = grade_response.split(separator)
    response_list = [response.strip() for response in raw_response_list]

    # Parse the grade
    is_correct = response_list[0].lower() == "true"

    # Parse the feedback
    feedback = response_list[1]

    return is_correct, feedback

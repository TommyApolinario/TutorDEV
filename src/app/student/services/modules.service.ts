import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponseAllModulesI, DataAllModulesI } from '../interfaces/modules';
import { ApiResponseFinishLessonModuleI, ApiResponseGetActivitiesByLessonI, ApiResponseValidateAnswerI, BodyValidateAnswerI } from '../interfaces/lessons';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  // Variables
  urlApi = environment.URL_API;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Access-Control-Request-Header': 'Content-type',
    'Access-Control-Allow-Origin': '*'
  });
  options = {}
  questionAnswered = new BehaviorSubject<string>('');

  // Constructor
  constructor(
    private http: HttpClient,
  ) { }

  //Método que consume el servicio que obtiene TODOS los módulos disponibles en la aplicación
  getAllModulesStudent(headers: Map<string, any>, page: number, limit: number, sort: string, order: string): Observable<ApiResponseAllModulesI> {
    this.options = this.getHeaders(headers);
    let queryParams = "?";
    queryParams += `page=${page}&`;
    queryParams += `limit=${limit}&`;
    queryParams += `sort=${sort}&`;
    queryParams += `order=${order}`;
    return this.http.get<ApiResponseAllModulesI>(this.urlApi + `/api/module/with-is-subscribed${queryParams}`, this.options);
  }

  //Método que obtiene la información de un módulo por su ID
  getModuleById(headers: Map<string, any>, idModule: number): Observable<DataAllModulesI> {
    this.options = this.getHeaders(headers);
    return this.http.get<DataAllModulesI>(this.urlApi + `/api/module/${idModule}`, this.options);
  }

  //Método que consume el servicio para generar una nueva lección según el ID del módulo
  newLesson(headers: Map<string, any>, idModule: number): Observable<number> {
    this.options = this.getHeaders(headers);
    return this.http.post<number>(this.urlApi + `/api/module/${idModule}/test`, null, this.options);
  }

  //Obtener las actividades según la nueva lección generada para un módulo seleccionado
  getActivitiesByLesson(headers: Map<string, any>, lessonId: number): Observable<ApiResponseGetActivitiesByLessonI> {
    this.options = this.getHeaders(headers);
    return this.http.get<ApiResponseGetActivitiesByLessonI>(this.urlApi + `/api/module/test/${lessonId}`, this.options);
  }


  //Método que cambia el valor a la variable selected para determinar si existe una opción seleccionada o completada
  setAnsweredOption(answer: string) {
    this.questionAnswered.next(answer);
  }

  //Método que obtiene el valor para determinar si la pregunta ya fue respondida y proceder a validarla
  getSelectedOption(): Observable<string> {
    return this.questionAnswered.asObservable();
  }

  //Método que consume el servicio para validar una pregunta
  validateResponseUser(headers: Map<string, any>, answerUserID:number, body: BodyValidateAnswerI): Observable<ApiResponseValidateAnswerI> {
    this.options = this.getHeaders(headers);
    return this.http.put<ApiResponseValidateAnswerI>(this.urlApi + `/api/module/test/validate-answer/${answerUserID}`, body, this.options);
  }

  //Método que finaliza una lección de actividades en un módulo, por medio del ID de la lección
  finishLesson(headers: Map<string, any>, lessonID: number): Observable<ApiResponseFinishLessonModuleI> {
    this.options = this.getHeaders(headers);
    return this.http.put<ApiResponseFinishLessonModuleI>(this.urlApi + `/api/module/test/${lessonID}/finish`, null, this.options);
  }

  //Método que obtiene los headers
  public getHeaders(headers: Map<string, any> | undefined) {
    if (headers != null) {
      headers.forEach((value, key) => {
        if (this.headers.has(key))
          this.headers = this.headers.delete(key);
        this.headers = this.headers.append(key, value || '');
      });
    }
    this.headers = this.headers.delete('Authorization');
    this.headers = this.headers.append('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    this.options = { headers: this.headers };
    return this.options;
  }
}

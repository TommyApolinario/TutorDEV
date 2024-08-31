import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseGenerateQuestionWithIAIT, ApiResponseListActivitiesIT, ApiResponseRegisterQuestionIT, BodyGenerateQuestionWithIAIT, BodyRegisterQuestionIT } from '../interfaces/activities.interface';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  // Variables
  urlApi = environment.URL_API;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Access-Control-Request-Header': 'Content-type',
    'Access-Control-Allow-Origin': '*'
  });
  options = {}

  // Constructor
  constructor(
    private http: HttpClient,
  ) { }

  //Método que consume el servicio para obtener el listado de actividades por el ID del módulo
  getActivitiesByModule(headers: Map<string, any>, page: number, limit: number, sort: string, order: string, idModule: number): Observable<ApiResponseListActivitiesIT> {
    this.options = this.getHeaders(headers);
    let queryParams = "?";
    queryParams += `page=${page}&`;
    queryParams += `limit=${limit}&`;
    queryParams += `sort=${sort}&`;
    queryParams += `order=${order}`;
    return this.http.get<ApiResponseListActivitiesIT>(this.urlApi + `/api/module/${idModule}/question/activities${queryParams}`, this.options);
  }

  //Método que consume el servicio para registrar una pregunta manualmente o con IA
  registerQuestion(headers: Map<string, any>, body: BodyRegisterQuestionIT, moduleID: number): Observable<ApiResponseRegisterQuestionIT> {
    this.options = this.getHeaders(headers);
    return this.http.post<ApiResponseRegisterQuestionIT>(this.urlApi + `/api/module/${moduleID}/question`, body, this.options);
  }
  
  //Método que consume el servicio para obtener una pregunta por su ID
  getQuestionById(headers: Map<string, any>, questionID: number): Observable<ApiResponseRegisterQuestionIT> {
    this.options = this.getHeaders(headers);
    return this.http.get<ApiResponseRegisterQuestionIT>(this.urlApi + `/api/module/question/${questionID}`, this.options);
  }

  //Método que consume el servicio para actualizar una pregunta
  updateQuestion(headers: Map<string, any>, body: BodyRegisterQuestionIT, moduleID: number, activityID: number): Observable<any> {
    this.options = this.getHeaders(headers);
    return this.http.put<any>(this.urlApi + `/api/module/${moduleID}/question/${activityID}`, body, this.options);
  }

  //Método que consume el servicio para eliminar una pregunta
  deleteQuestion(headers: Map<string, any>, moduleID: number, activityID: number): Observable<any> {
    this.options = this.getHeaders(headers);
    return this.http.delete<any>(this.urlApi + `/api/module/${moduleID}/question/${activityID}`, this.options);
  }

  //Método que consume el servicio para generar preguntas con IA
  generateQuestionWithIA(headers: Map<string, any>, body: BodyGenerateQuestionWithIAIT): Observable<ApiResponseGenerateQuestionWithIAIT> {
    this.options = this.getHeaders(headers);
    return this.http.post<ApiResponseGenerateQuestionWithIAIT>(this.urlApi + `/api/gpt/generate-question`, body, this.options);
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

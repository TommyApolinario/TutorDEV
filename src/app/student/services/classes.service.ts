import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponseJoinToClassI, ApiResponseListClassesI, ApiResponseListsStudentsI, JoinToClassI } from '../interfaces/classes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

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

  //Método que consume el servicio para obtener el listado de las clases
  getListClassesStudent(headers: Map<string, any>): Observable<ApiResponseListClassesI[]> {
    this.options = this.getHeaders(headers);
    return this.http.get<ApiResponseListClassesI[]>(this.urlApi + `/api/classes/subscribed`, this.options);
  }

  //Método que consume el servicio para inscribirse a una clase
  joinToNewClass(headers: Map<string, any>, body: JoinToClassI): Observable<ApiResponseJoinToClassI> {
    this.options = this.getHeaders(headers);
    return this.http.post<ApiResponseJoinToClassI>(this.urlApi + `/api/classes/subscribe`, body, this.options);
  }

  //Método que consume el servicio para obtener el listado de estudiantes de una clase
  getStudents(headers: Map<string, any>, classID: number): Observable<ApiResponseListsStudentsI> {
    this.options = this.getHeaders(headers);
    return this.http.get<ApiResponseListsStudentsI>(this.urlApi + `/api/classes/${classID}/students`, this.options);
  }

  //Método que consume el servicio para que un estudiante abandone la clase
  leaveClass(headers: Map<string, any>, classID: number): Observable<any> {
    this.options = this.getHeaders(headers);
    return this.http.delete<any>(this.urlApi + `/api/classes/${classID}/unsubscribe`, this.options);
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

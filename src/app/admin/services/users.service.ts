import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponseListUsersI } from '../interfaces/users.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  //Método que consume el servicio para obtener el listado de módulos creados por el profesor
  getListUsers(headers: Map<string, any>): Observable<ApiResponseListUsersI[]> {
    this.options = this.getHeaders(headers);
    return this.http.get<ApiResponseListUsersI[]>(this.urlApi + `/api/users/`, this.options);
  }

  //Método que consume el servicio para aprobar (activar) un usuario
  approveUser(userID: number): Observable<any> {
    return this.http.put<any>(this.urlApi + `/api/users/${userID}/approved`, {}, this.options);
  }

  //Método que consume el servicio para desactivar (bloquear) un usuario
  desactivateUser(userID: number): Observable<any> {
    return this.http.put<any>(this.urlApi + `/api/users/${userID}/blocked`, {}, this.options);
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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseLogin } from '../interfaces/login';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /*Variables*/
  email = '';
  password = '';
  urlApi = environment.URL_API;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Access-Control-Request-Header': 'Content-type',
    'Access-Control-Allow-Origin': '*'
  });
  options = {}

  /*Constructor*/
  constructor(
    private http: HttpClient
  ) { }

  /*Método que consume el servicio para iniciar sesión*/
  loginUser(body:any): Observable<ApiResponseLogin> {
    return this.http.post<ApiResponseLogin>(this.urlApi + "/api/auth/sign-in", body);
  }

  /*Método que obtiene los Headers*/
  public getHeaders(headers: Map<string, any> | undefined) {
    if (headers != null) {
      headers.forEach((value, key) => {
        if(this.headers.has(key))
          this.headers = this.headers.delete(key);
        this.headers = this.headers.append(key, value || '');
      });
    }
    this.headers = this.headers.delete('Authorization');
    this.headers = this.headers.append('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    this.options = { headers: this.headers };
    return this.options;
  }

  /*Método que elimina headers*/
  public removeHeaders(headers: string[] | undefined) {
    if (headers != null) {
      headers.forEach((value) => {
        if (this.headers.has(value)) {
          this.headers = this.headers.delete(value);
        }
      });
    }
    this.options = { headers: this.headers };
    return this.options;
  }
}

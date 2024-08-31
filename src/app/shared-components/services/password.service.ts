import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BodyChangePasswordInApp, ResponseChangePassword } from '../interfaces/password';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
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

  //Método que consume el servicio que cambia la contraseña dentro de la aplicación
  changePassword(headers: Map<string, any>, body: BodyChangePasswordInApp): Observable<ResponseChangePassword> {
    this.options = this.getHeaders(headers);
    return this.http.put<ResponseChangePassword>(this.urlApi + `/api/auth/change-password/inside`, body, this.options);
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

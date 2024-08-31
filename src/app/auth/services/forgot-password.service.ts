import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { environment } from '../../../environments/environment';
import { ApiResponseForgotPasswordI, ForgotPasswordI } from '../interfaces/forgot-password';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  // Variables
  urlApi = environment.URL_API;
  options = {}

  // Constructor
  constructor(
    private http: HttpClient,
  ) { }

  //Método que consume el servicio que envía el email para enviar correo de recuperación
  sendEmailRecoveryPassword(body: ForgotPasswordI): Observable<ApiResponseForgotPasswordI> {
    // this.options = this.authService.getHeaders(headers);
    return this.http.post<ApiResponseForgotPasswordI>(this.urlApi + "/api/auth/reset-password", body);
  }
}

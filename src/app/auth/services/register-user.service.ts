import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseRegisterUserI, RegisterUserI } from '../interfaces/register-user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

    // Variables
    urlApi = environment.URL_API;
    options = {}
  
    // Constructor
    constructor(
      private http: HttpClient,
    ) { }
  
    //Método que consume el servicio para registrar un nuevo usuario
    registerNewUser(body: RegisterUserI): Observable<ApiResponseRegisterUserI> {
      return this.http.post<ApiResponseRegisterUserI>(this.urlApi + "/api/auth/sign-up", body, {});
    }
}

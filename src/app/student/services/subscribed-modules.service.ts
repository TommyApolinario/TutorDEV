import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseSubscribeToModuleI, ApiResponseSubscribedModulesI, SubscribeToModuleI } from '../interfaces/subscribed-modules';

@Injectable({
  providedIn: 'root'
})
export class SubscribedModulesService {

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
 
   //Método que consume el servicio para que un estudiante se suscriba a un módulo
   subscribeToModule(headers: Map<string, any>, codeModule:SubscribeToModuleI): Observable<ApiResponseSubscribeToModuleI> {
    this.options = this.getHeaders(headers);
    return this.http.post<ApiResponseSubscribeToModuleI>(this.urlApi + `/api/module/subscribe`, codeModule, this.options);
  }

   //Método que consume el servicio que obtiene los módulos a los que un estudiante está suscrito
   getModulesSubscribedStudent(headers: Map<string, any>, page: number, limit: number, sort: string, order: string): Observable<ApiResponseSubscribedModulesI> {
     this.options = this.getHeaders(headers);
     let queryParams = "?";
     queryParams += `page=${page}&`;
     queryParams += `limit=${limit}&`;
     queryParams += `sort=${sort}&`;
     queryParams += `order=${order}`;
     return this.http.get<ApiResponseSubscribedModulesI>(this.urlApi + `/api/module/subscribed${queryParams}`, this.options);
   }
 
   
   //Método que obtiene los headers
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
}

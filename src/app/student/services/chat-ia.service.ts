import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseChatIAI, BodyChatIAI } from '../interfaces/chat-ia';

@Injectable({
  providedIn: 'root'
})
export class ChatIaService {
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

  //Método que consume el servicio del chat para obtener las respuestas de la IA
  getChatResponse(headers: Map<string, any>, message: BodyChatIAI): Observable<ApiResponseChatIAI> {
    this.options = this.getHeaders(headers);
    return this.http.post<ApiResponseChatIAI>(this.urlApi + `/api/gpt/generate-response`, message, this.options);
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
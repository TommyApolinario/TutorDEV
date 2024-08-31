import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseGetTopTenI } from '../interfaces/statistics';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
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
  getTopTenUsers(headers: Map<string, any>, lastDate: string, currentDate:string): Observable<ApiResponseGetTopTenI[]> {
    this.options = this.getHeaders(headers);
    let queryParams = "?";
    queryParams += `start=${lastDate}&`;
    queryParams += `end=${currentDate}&`;
    return this.http.get<ApiResponseGetTopTenI[]>(this.urlApi + `/api/statistics/points-module${queryParams}limit=10`, this.options);
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

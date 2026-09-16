import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/${endpoint}`, data);
  }

  get(endpoint: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/${endpoint}`);
  }

  put(endpoint: string, data: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/${endpoint}`, data);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${endpoint}`);
  }

  postForm(endpoint: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${API_URL}/${endpoint}`, formData);
  }
}
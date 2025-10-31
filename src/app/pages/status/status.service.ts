import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
console.log(environment.apiUrl);
@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private apiUrl = `${environment.apiUrl}/dataset`;

  constructor(private http: HttpClient) { }

  getDatasets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent`);
  }

  getAllDatasets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
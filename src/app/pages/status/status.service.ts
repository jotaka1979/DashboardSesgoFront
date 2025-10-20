import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private apiUrl = 'http://127.0.0.1:8000/api/dataset'; // endpoint de Django

  constructor(private http: HttpClient) {}

  // GET simple
  getDatasets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/report`;

  constructor(private http: HttpClient) { }
  

  getHateDistribution(payload: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.apiUrl}/hate`, payload);
    return this.http.request(req);

  }

}
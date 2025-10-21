import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DatasetService {
  private apiUrl = `${environment.apiUrl}/dataset`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, description: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('data', `{"name":"eee", "description":"${description}"}`);

    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}

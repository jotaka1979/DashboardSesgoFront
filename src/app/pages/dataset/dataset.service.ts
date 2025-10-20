import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatasetService {
  private apiUrl = 'http://127.0.0.1:8000/api/dataset';

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

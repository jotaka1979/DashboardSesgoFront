import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DatasetService {
  private apiUrl = `${environment.apiUrl}/dataset`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, description: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('data', `{"description":"${description}"}`);

    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  reuploadFile(file: File, description: string, dataset_id: number): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('data', `{"dataset_id":${dataset_id}, "description":"${description}"}`);

    const req = new HttpRequest('PUT', this.apiUrl, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

    deleteDataset(dataset_id: number): Observable<HttpEvent<any>> {
    const req = new HttpRequest('DELETE', `${this.apiUrl}/${dataset_id}`);

    return this.http.request(req);
  }
}

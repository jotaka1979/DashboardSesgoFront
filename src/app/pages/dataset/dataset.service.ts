import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://127.0.0.1:8000/api/upload'; // <-- cambia por tu endpoint

  constructor(private http: HttpClient) {}

  uploadFile(file: File, description:string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('data', `{"name":"eee", "description":"${description}"}`)

    // Configuramos el request con reportProgress para monitorear el progreso
    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProcessService {
    private apiUrl = `${environment.apiUrl}/process`;

    constructor(private http: HttpClient) { }

    processDataset(dataset_id: number): Observable<HttpEvent<any>> {
        console.log("llama", dataset_id)
        const req = new HttpRequest('POST', `${this.apiUrl}/${dataset_id}`, null, {
            reportProgress: true,
        });

        return this.http.request(req);
    }
}
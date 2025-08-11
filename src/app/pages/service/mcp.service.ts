import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environement';
@Injectable({ providedIn: 'root' })
export class McpService {
    private apiUrlmcp = `${environment.apiBaseUrl}/mcp_client`;

    constructor(private http: HttpClient) { }

    askMcp(text: string): Observable<{ response: string }> {
        return this.http.post<{ response: string }>(this.apiUrlmcp, { message: text });
    }
}
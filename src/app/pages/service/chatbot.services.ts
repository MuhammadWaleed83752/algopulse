import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environement';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrlChat = `${environment.apiBaseUrl}/ask-llm`;

  constructor(private http: HttpClient) {}

  askLLM(text: string): Observable<any> {
    // Send the text as part of the request body
    return this.http.post<any>(this.apiUrlChat, { text });
  }
}
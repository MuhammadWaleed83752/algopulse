import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrlChat = 'http://localhost:8000/ask-llm'; // Ensure this matches your backend endpoint

  constructor(private http: HttpClient) {}

  askLLM(text: string): Observable<any> {
    // Send the text as part of the request body
    return this.http.post<any>(this.apiUrlChat, { text });
  }
}
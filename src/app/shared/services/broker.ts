import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ChatBotResponse {
  question: string;
  referenceUsed: string;
  adviceGiven: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  private readonly apiUrl = 'https://localhost:7006/api/ChatBot/ask';
  private readonly authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNSIsInVuaXF1ZV9uYW1lIjoiZXNzYW0iLCJlbWFpbCI6ImVzc2FtQGdtYWlsLmNvbSIsImp0aSI6ImY2ZGMxMjkyLTQwOWMtNGMxYi1hNTFhLTE1ZDE5ZDRhZGRhYyIsImV4cCI6MTc1NjIzMDc2OCwiaXNzIjoiWW91ckFwcCIsImF1ZCI6IllvdXJBcHBVc2VycyJ9.DhL4Va6yOyjJblUwhqv7BcGF8S8FayQQHr8o2zMBmQ4';

  constructor(private http: HttpClient) {}

  askChatBot(message: string): Observable<ChatBotResponse> {
    try {
      console.log('Preparing API request with message:', message);
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });

      const url = `${this.apiUrl}?message=${encodeURIComponent(message)}`;
      console.log('Sending request to:', url);
      
      return this.http.get<ChatBotResponse>(url, { 
        headers,
        withCredentials: true 
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url
          });
          return throwError(() => error); // Re-throw to be handled by the component
        })
      );
    } catch (error) {
      console.error('Error in askChatBot:', error);
      throw error;
    }
  }
}
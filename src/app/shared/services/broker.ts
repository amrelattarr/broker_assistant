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

  constructor(private http: HttpClient) {}

  askChatBot(message: string): Observable<ChatBotResponse> {
    try {
      console.log('Preparing API request with message:', message);
      
      // Get token from localStorage
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
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
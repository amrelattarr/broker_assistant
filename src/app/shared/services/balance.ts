import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Balance {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7006/api/User';
  private readonly TOKEN_KEY = 'auth_token'; // Updated to match other services

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      console.error('No authentication token found');
      // You might want to redirect to login here
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Session expired. Please log in again.';
      // Consider redirecting to login page here
    } else if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getBalance(): Observable<{ userId: number; balance: number }> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<{ userId: number; balance: number }>(
      `${this.baseUrl}/GetBalance`,
      { 
        headers,
        observe: 'body',
        responseType: 'json'
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  editBalance(amount: number): Observable<any> {
    if (!amount || amount <= 0) {
      return throwError(() => new Error('Invalid amount'));
    }

    const headers = this.getAuthHeaders();
    
    return this.http.post(
      `${this.baseUrl}/AddBalance`,
      { amount },
      { 
        headers,
        observe: 'response', // Get full response including headers
        responseType: 'json'
      }
    ).pipe(
      catchError(this.handleError)
    );
  }
}

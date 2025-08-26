import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Egx30Dto {
  egxId: number;
  time: string;
  borsaDate: string;
  indexValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartsData {
  private apiUrl = 'https://localhost:7006/api/Egx30';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders(): Observable<HttpHeaders> {
    // Get the token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // Create headers with the token if it exists
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return new Observable(subscriber => {
      subscriber.next(headers);
      subscriber.complete();
    });
  }

  getEgx30Data(): Observable<Egx30Dto[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<Egx30Dto[]>(this.apiUrl, { headers }).pipe(
          map(data => {
            // Ensure we have data before processing
            if (!data || !Array.isArray(data)) {
              return [];
            }
            // Sort data by date and time
            return data.sort((a, b) => 
              new Date(a.borsaDate).getTime() - new Date(b.borsaDate).getTime()
            );
          })
        );
      })
    );
  }

  getChartData() {
    return this.getEgx30Data().pipe(
      map(data => ({
        labels: data.map(item => {
          const date = new Date(item.borsaDate);
          return `${date.toLocaleDateString()} ${item.time}`;
        }),
        datasets: [{
          label: 'EGX30 Index Value',
          data: data.map(item => item.indexValue),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }]
      }))
    );
  }
}

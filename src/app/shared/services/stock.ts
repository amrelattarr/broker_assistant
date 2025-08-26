import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Stock {
  private readonly httpclient = inject(HttpClient)

  getAllStocks(): Observable<any>{
    const headers: Record<string, string> = { 'accept': '*/*' };
    try {
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch {}
    return this.httpclient.get('https://localhost:7006/api/Stock', { headers })
  }
  
}

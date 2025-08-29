import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuyStockService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7006/api/UserStock';
  private readonly TOKEN_KEY = 'auth_token';

  buyStock(stockId: number): Observable<any> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });

    const url = `${this.baseUrl}/buy`;
    const body = { stockId };
    console.log('[BuyStock] POST', url, body, { hasToken: !!token });
    return this.http.post(url, body, { headers, withCredentials: true });
  }

  getUserStocks(userId: number): Observable<any> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });

    const url = `${this.baseUrl}/${encodeURIComponent(String(userId))}`;
    console.log('[BuyStock] GET', url, { hasToken: !!token });
    return this.http.get(url, { headers, withCredentials: true });
  }
}


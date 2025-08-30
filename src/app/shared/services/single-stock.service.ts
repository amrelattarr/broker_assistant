import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface StockDetails {
  userId: number;
  stockId: number;
  englishName: string;
  symbol: string;
  currentValue: number;
  buyPrice: number;
  sellPrice: number;
  changeAmount: number;
  isSellOrderActive: boolean;
  targetSellPrice: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class SingleStockService {
  private http = inject(HttpClient);

  /**
   * Fetches details for a specific stock for a user
   * @param userId The ID of the user
   * @param stockId The ID of the stock to fetch details for
   * @returns Observable with the stock details
   */
  private readonly TOKEN_KEY = 'auth_token';

  getStockDetails(userId: number, stockId: number) {
    console.log('Fetching stock details for:', { userId, stockId });
    
    // Get the JWT token from local storage
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    if (!token) {
      console.error('No JWT token found in localStorage');
      throw new Error('Authentication token not found');
    }
    
    // Set up headers with authorization
    const headers = {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`
    };
    
    const url = `${environment.apiUrl}/UserStock/stock/${userId}/${stockId}`;
    console.log('API URL:', url);
    
    // Make the API call with both userId and stockId in the URL
    return this.http.get<StockDetails>(url, { headers }).pipe(
      tap({
        next: (data) => console.log('Stock details received:', data),
        error: (error) => console.error('Error fetching stock details:', error)
      })
    );
  }
}

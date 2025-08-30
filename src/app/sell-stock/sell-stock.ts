import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sell-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sell-stock.html',
  styleUrl: './sell-stock.css'
})
export class SellStockComponent implements OnInit {
  stockId: number | null = null;
  targetPrice: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.stockId = +id;
      } else {
        this.errorMessage = 'No stock ID provided';
      }
    });
  }

  onSubmit(): void {
    if (!this.stockId || !this.targetPrice) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.errorMessage = 'Authentication required. Please log in again.';
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      stockId: this.stockId,
      targetSellPrice: this.targetPrice
    };

    this.http.post(`${environment.apiUrl}/UserStock/sell`, requestBody, { headers })
      .subscribe({
        next: (response: any) => {
          this.successMessage = response.message || 'Sell order created successfully!';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating sell order:', error);
          this.errorMessage = error.error?.message || 'Failed to create sell order. Please try again.';
          this.isLoading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

import { Component, inject, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Stock } from '../shared/services/stock';
import { Istock } from '../shared/models/istock';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Balance } from '../shared/services/balance';
import { Subscription } from 'rxjs';
import { BuyStockService } from '../shared/services/buy-stock';

@Component({
  selector: 'app-stocks',
  imports: [DecimalPipe, NgClass, NgIf],
  templateUrl: './stocks.html',
  styleUrl: './stocks.css'
})
export class Stocks implements OnInit, AfterViewInit {
  @ViewChildren('stockRow') stockRows!: QueryList<ElementRef>;
  private readonly stock = inject(Stock);
  private readonly balanceService = inject(Balance);
  private readonly buyStockService = inject(BuyStockService);
  private balanceSubscription?: Subscription;

  stockList: Istock[] = [];
  balance: number = 0;
  isLoadingBalance: boolean = true;
  buyingStockIds = new Set<number>();
  boughtStockIds = new Set<number>();

  highlightedStockId: number = localStorage.getItem('highlightedStockId') 
    ? parseInt(localStorage.getItem('highlightedStockId')!) 
    : -1;

  ngOnInit(): void {
    this.loadBalance();
    this.getAllStocksData();
    this.restoreBoughtStateFromServer();
  }

  onBuy(stockId: number): void {
    if (this.buyingStockIds.has(stockId) || this.boughtStockIds.has(stockId)) return;
    this.buyingStockIds.add(stockId);
    this.buyStockService.buyStock(stockId).subscribe({
      next: () => {
        this.buyingStockIds.delete(stockId);
        this.boughtStockIds.add(stockId);
        this.loadBalance();
      },
      error: () => {
        this.buyingStockIds.delete(stockId);
      }
    });
  }

  private restoreBoughtStateFromServer(): void {
    
    let userId: number | null = null;
    try {
    } catch {}

    const tryLoad = () => {
      // After balance loads, we have userId in response type
      if (this.isLoadingBalance) {
        setTimeout(tryLoad, 200);
        return;
      }
      this.balanceService.getBalance().subscribe({
        next: (response) => {
          const uid = (response as any).userId as number | undefined;
          if (!uid) return;
          this.buyStockService.getUserStocks(uid).subscribe({
            next: (userStocks) => {
              const ids: number[] = Array.isArray(userStocks)
                ? userStocks.map((s: any) => s.stockId).filter((v: any) => typeof v === 'number')
                : [];
              this.boughtStockIds = new Set(ids);
            },
            error: () => {}
          });
        },
        error: () => {}
      });
    };
    tryLoad();
  }

  private loadBalance(): void {
    this.isLoadingBalance = true;
    console.log('Fetching balance...');
    this.balanceSubscription = this.balanceService.getBalance().subscribe({
      next: (response) => {
        console.log('Balance API Response:', response);
        this.balance = response.balance;
        console.log('Balance set to:', this.balance);
        this.isLoadingBalance = false;
      },
      error: (error) => {
        console.error('Error loading balance:', error);
        this.balance = 0;
        this.isLoadingBalance = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.highlightedStockId > 0) {
      setTimeout(() => this.scrollToHighlightedRow(), 500);
    }
  }

  private scrollToHighlightedRow(): void {
    if (this.stockRows && this.highlightedStockId > 0) {
      const rows = this.stockRows.toArray();
      const rowIndex = this.stockList.findIndex(stock => stock.stockId === this.highlightedStockId);
      
      if (rowIndex >= 0 && rows[rowIndex]) {
        rows[rowIndex].nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }

  getAllStocksData(){
    this.stock.getAllStocks().subscribe(
      (res) => {
        this.stockList = res
      }
    )
  }



  ngOnDestroy(): void {
    localStorage.removeItem('highlightedStockId');
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
    }
  }
}

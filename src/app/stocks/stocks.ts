import { Component, inject, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Stock } from '../shared/services/stock';
import { Istock } from '../shared/models/istock';
import { DecimalPipe } from '@angular/common';
import { Balance } from '../shared/services/balance';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stocks',
  imports: [DecimalPipe],
  templateUrl: './stocks.html',
  styleUrl: './stocks.css'
})
export class Stocks implements OnInit, AfterViewInit {
  @ViewChildren('stockRow') stockRows!: QueryList<ElementRef>;
  private readonly stock = inject(Stock);
  private readonly balanceService = inject(Balance);
  private balanceSubscription?: Subscription;

  stockList: Istock[] = [];
  balance: number = 0;
  isLoadingBalance: boolean = true;

  highlightedStockId: number = localStorage.getItem('highlightedStockId') 
    ? parseInt(localStorage.getItem('highlightedStockId')!) 
    : -1;

  ngOnInit(): void {
    this.loadBalance();
    this.getAllStocksData();
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
    // Scroll to highlighted row after view is initialized and data is loaded
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

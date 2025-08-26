import { Component, inject, OnInit } from '@angular/core';
import { Stock } from '../shared/services/stock';
import { Istock } from '../shared/models/istock';

@Component({
  selector: 'app-stocks',
  imports: [],
  templateUrl: './stocks.html',
  styleUrl: './stocks.css'
})
export class Stocks implements OnInit{
  private readonly stock = inject(Stock)

  stockList: Istock[] = [];
  balance: number = 0;

  ngOnInit(): void {
    const balance = localStorage.getItem('Balance');
    if (balance) {
      try {
        this.balance = parseFloat(balance);
      } catch (error) {
        this.balance = 0;
      }
    } else {
      this.balance = 0;
    }
    this.getAllStocksData()
  }

  getAllStocksData(){
    this.stock.getAllStocks().subscribe(
      (res) => {
        this.stockList = res
      }
    )
  }
}

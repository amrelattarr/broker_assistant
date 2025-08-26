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

  stockList: Istock[] = []

  ngOnInit(): void {
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

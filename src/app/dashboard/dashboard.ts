import { Component } from '@angular/core';
import { ChartsData } from '../shared/services/charts-data';
import { inject } from '@angular/core';
import 'chartjs-chart-financial';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  public chartsData = inject(ChartsData);

  get pieChartData() {
    return this.chartsData.pieChartData;
  }
  get barChartData() {
    return this.chartsData.barChartData;
  }
  get lineChartData() {
    return this.chartsData.lineChartData;
  }
  get bitcoinLineChartData() {
    return this.chartsData.bitcoinLineChartData;
  }
}



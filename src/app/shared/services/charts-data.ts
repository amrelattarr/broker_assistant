import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartsData {
  public pieChartData = {
    labels: ['Retail', 'Institutional', 'New', 'Returning'],
    datasets: [{ data: [350, 120, 200, 80] }]
  };

  public barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      { data: [120, 150, 170, 130, 180, 200, 220], label: '2025' },
      { data: [100, 120, 140, 110, 160, 190, 210], label: '2024' }
    ]
  };

  public lineChartData = {
    labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    datasets: [
      { data: [50, 120, 180, 220, 260, 310, 400], label: 'Retail Trades', fill: false, borderColor: '#0d6efd', tension: 0.4 },
      { data: [30, 80, 130, 170, 200, 250, 300], label: 'Institutional Trades', fill: false, borderColor: '#28a745', tension: 0.4 },
      { data: [10, 40, 60, 90, 120, 140, 180], label: 'Automated Trades', fill: false, borderColor: '#fd7e14', tension: 0.4 }
    ]
  };

  public bitcoinLineChartData = {
    labels: [
      'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
      'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'
    ],
    datasets: [
      {
        data: [32000, 45000, 59000, 60000, 37000, 35000, 40000, 47000, 43000, 61000, 57000, 48000],label: 'BTC Closing Price',fill: false,borderColor: '#3b5998',tension: 0.2
      }
    ]
  };
  
}

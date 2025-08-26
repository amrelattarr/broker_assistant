import { Component, OnInit } from '@angular/core';
import { ChartsData, Egx30Dto } from '../shared/services/charts-data';
import { inject } from '@angular/core';
import 'chartjs-chart-financial';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}

const DEFAULT_CHART_DATA: ChartData = {
  labels: [],
  datasets: [{
    label: 'EGX30 Index Value',
    data: [],
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    tension: 0.4,
    fill: true
  }]
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  public chartsData = inject(ChartsData);
  public chartData: ChartData = DEFAULT_CHART_DATA;
  public isLoading = true;
  public error: string | null = null;

  // Chart options
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            
            // Calculate daily change if we have previous data point
            let change = '';
            if (context.dataIndex > 0) {
              const prevValue = context.dataset.data[context.dataIndex - 1];
              const diff = value - prevValue;
              const percentChange = (diff / prevValue) * 100;
              const changeSymbol = diff >= 0 ? '▲' : '▼';
              change = ` (${changeSymbol}${Math.abs(diff).toFixed(2)} | ${Math.abs(percentChange).toFixed(2)}%)`;
            }
            
            return `${label}: ${value.toLocaleString('en-US')}${change}`;
          },
          title: (tooltipItems: any) => {
            return tooltipItems[0].label;
          }
        },
        displayColors: false
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date & Time'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
          callback: (value: any, index: number, values: any[]) => {
            // Only show every 5th label to prevent overcrowding
            if (index % 5 === 0 || index === values.length - 1) {
              return value;
            }
            return '';
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Index Value'
        },
        beginAtZero: false,
        ticks: {
          callback: (value: any) => value.toLocaleString('en-US')
        }
      }
    },
    elements: {
      point: {
        radius: (context: any) => {
          // Only show points on hover or for the last data point
          return context.dataIndex === context.dataset.data.length - 1 ? 5 : 0;
        },
        hoverRadius: 5
      },
      line: {
        borderWidth: 2,
        tension: 0.1
      }
    },
    animation: {
      duration: 1000
    }
  };

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.isLoading = true;
    this.error = null;
    
    this.chartsData.getChartData().subscribe({
      next: (data) => {
        this.chartData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading EGX30 data:', err);
        this.error = 'Failed to load EGX30 data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Calculate daily statistics
  get dailyStats() {
    if (!this.chartData?.datasets?.[0]?.data?.length) {
      return null;
    }

    const values = this.chartData.datasets[0].data;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = lastValue - firstValue;
    const percentChange = (change / firstValue) * 100;
    const isPositive = change >= 0;

    return {
      current: lastValue,
      change: Math.abs(change),
      percentChange: Math.abs(percentChange),
      isPositive,
      changeSymbol: isPositive ? '▲' : '▼',
      changeClass: isPositive ? 'text-success' : 'text-danger'
    };
  }

  // Getter for template to access chart data
  get lineChartData() {
    // Add gradient to the line
    const gradient = (ctx: any) => {
      const chart = ctx.chart;
      const {ctx: context, chartArea} = chart;
      if (!chartArea) {
        return null;
      }
      
      const gradientBg = context.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradientBg.addColorStop(0, 'rgba(75, 192, 192, 0.1)');
      gradientBg.addColorStop(1, 'rgba(75, 192, 192, 0.4)');
      
      return gradientBg;
    };

    return {
      ...this.chartData,
      datasets: this.chartData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: gradient,
        borderColor: '#4bc0c0',
        pointBackgroundColor: (context: any) => {
          const index = context.dataIndex;
          if (index === 0 || index === context.dataset.data.length - 1) {
            return '#4bc0c0';
          }
          return 'transparent';
        },
        pointBorderColor: '#4bc0c0',
        pointHoverBackgroundColor: '#4bc0c0',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointHitRadius: 10,
        pointHoverRadius: 7,
        borderWidth: 2,
        fill: true
      }))
    };
  }
}



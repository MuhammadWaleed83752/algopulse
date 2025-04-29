import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from './../../../../layout/service/layout.service';
import { CryptoService } from '../../../service/crypto.service';


@Component({
    standalone: true,
    selector: 'app-top-crypto-price-chart',
    imports: [ChartModule],
    templateUrl: './topCryptoPriceChart.html',
})
export class TopCryptoPriceChart {

    cryptos!: any[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    historicalPrices: { time: string, price: number }[] = [];

    constructor(public layoutService: LayoutService, private cryptoService: CryptoService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
        });
    }

    ngOnInit() {
        const stored = localStorage.getItem('btcPrices');
        this.historicalPrices = stored ? JSON.parse(stored) : [];
      
        if (this.historicalPrices.length < 20) {
          this.fetchAndStorePrice(); // Fetch first point immediately
          const interval = setInterval(() => {
            this.fetchAndStorePrice();
      
            if (this.historicalPrices.length >= 20) {
              clearInterval(interval); // Stop calling the API after 20 entries
            }
          }, 200000000); // every 20 seconds
        } else {
          this.updateChart(); // Use cached data if already full
        }
      }


      fetchAndStorePrice(): void {
        const documentStyle = getComputedStyle(document.documentElement);
      
        this.cryptoService.getCryptos().subscribe((res: any) => {
          const btc = res.data.find((coin: any) => coin.symbol === 'BTC');
          const price = btc.quote.USD.price;
          const time = new Date().toLocaleTimeString();
      
          this.historicalPrices.push({ time, price });
      
          // Save up to 20 entries only
        //   if (this.historicalPrices.length > 20) {
        //     this.historicalPrices = this.historicalPrices.slice(-20);
        //   }
      
          localStorage.setItem('btcPrices', JSON.stringify(this.historicalPrices));
          localStorage.setItem('btcLastUpdated', Date.now().toString());
      
          this.updateChart();
        });
      }
      
      updateChart(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
      
        this.chartData = {
          labels: this.historicalPrices.map(item => item.time),
          datasets: [{
            label: 'BTC Price (USD)',
            data: this.historicalPrices.map(item => item.price),
            borderColor: documentStyle.getPropertyValue('--p-primary-500'),
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: documentStyle.getPropertyValue('--p-primary-400')
          }]
        };
      
        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: textColor
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: textMutedColor
              },
              grid: {
                color: borderColor
              }
            },
            y: {
              beginAtZero: false,
              ticks: {
                color: textMutedColor
              },
              grid: {
                color: borderColor
              }
            }
          }
        };
      }

 
}

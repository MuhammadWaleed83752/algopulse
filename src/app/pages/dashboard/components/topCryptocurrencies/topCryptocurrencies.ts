import { Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../service/product.service';
import { CryptoService } from '../../../service/crypto.service';


@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    templateUrl: './topCryptocurrencies.html',
    // styleUrls: ['./recentsaleswidget.scss'],
    providers: [ProductService]
})
export class RecentSalesWidget implements OnInit {
    products!: Product[];

    cryptos!: any[];

    constructor(private productService: ProductService, private cryptoService: CryptoService) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data));
        
        this.cryptoService.getCryptos(25).subscribe({
            next: data => {
              this.cryptos = data.data;  // CoinMarketCap wraps actual data in `data`
                // console.log('Cryptos:', this.cryptos);
                this.cryptos = data.data.map((crypto: any) => ({
                    ...crypto,
                    price: crypto.quote.USD.price,
                    marketCap: crypto.quote.USD.market_cap
                  }))
            },
            error: err => {
              console.error('Error fetching cryptos:', err);
            }
          });
    }
}

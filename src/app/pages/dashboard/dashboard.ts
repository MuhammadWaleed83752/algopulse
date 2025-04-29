import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
// import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/topCryptocurrencies/topCryptocurrencies';
import { BestSellingWidget } from './components/bestsellingwidget';
// import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { TopCryptoPriceChart } from './components/topCryptoPriceChart/topCryptoPriceChart';
import { CryptoStatsWidget } from './components/cryptoStats/cryptoStats';

@Component({
    selector: 'app-dashboard',
    imports: [RecentSalesWidget, BestSellingWidget, NotificationsWidget, TopCryptoPriceChart, CryptoStatsWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-crypto-stats class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-top-crypto-price-chart />
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard {}

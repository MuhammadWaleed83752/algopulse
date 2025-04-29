import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../../../service/crypto.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-crypto-stats',
    imports: [CommonModule],
    templateUrl: './cryptoStats.html',
})
export class CryptoStatsWidget {
    globalStats: any = {}; 
    isLoading: boolean = true; 
    error: string = '';
    subscription!: Subscription;


    

    constructor(private cryptoService: CryptoService) {}

    ngOnInit(): void {
        // Calling the service to get crypto stats
        this.subscription = this.cryptoService.getCryptoStats().subscribe(
            (res: any) => {
                if (res && res.data) {
                    this.globalStats = res.data;
                    this.isLoading = false;  // Set loading to false when data is fetched
                } else {
                    this.error = 'No data found';
                    this.isLoading = false;
                }
            },
            (err) => {
                this.error = 'Error fetching crypto stats: ' + err.message;
                this.isLoading = false;
            }
        );
    }

    ngOnDestroy(): void {
        // Make sure to unsubscribe when the component is destroyed
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
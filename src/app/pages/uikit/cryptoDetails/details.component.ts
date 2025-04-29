import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { FluidModule } from 'primeng/fluid';
// import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Exchange } from '../../service/customer.service';
// import { Product, ProductService } from '../../service/product.service';
import { CryptoService } from '../../service/crypto.service';
import { Subscription } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';


@Component({
    selector: 'app-tree-demo',
    standalone: true,
    imports: [FormsModule,
        ButtonModule,
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        RatingModule,
        RippleModule,
        IconFieldModule
    ],
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    providers: [ConfirmationService, MessageService],
})
export class Details implements OnInit {

    subscription!: Subscription;


    dropdownItems: Exchange[] = [];

    dropdownItem: Exchange | null = null;

    selectedExchangeDetails: any = null;
    selectedExchangeName: string | null = null;
    selectedExchangeImageUrl: string | null = null;
    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private cryptoService: CryptoService, private toast: HotToastService
    ) { }

    showToast() {
        this.toast.show('Hello World!');
        this.toast.loading('Lazyyy...');
        this.toast.success('Yeah!!');
        this.toast.warning('Boo!');
        this.toast.error('Oh no!');
        this.toast.info('Something...');
      }

    ngOnInit() {
        this.getExchanges();
    }

    getExchanges() {
        this.subscription = this.cryptoService.getExchanges().pipe(
            this.toast.observe({
              loading: 'Loading Data...',
              success: 'Data Loaded!',
              error: 'Unable to Get Data',
            })
          ).subscribe({
            next: (res: any) => {
                this.dropdownItems = res;
            },
            error: (err) => {
                console.error('Error fetching crypto stats: ', err);
            }
        });
    }

    onExchangeSelected() {
        if (this.dropdownItem) {
            this.cryptoService.getExchangeDetails(this.dropdownItem.id).pipe(
                this.toast.observe({
                  loading: 'Loading Data...',
                  success: 'Data Loaded!',
                  error: 'Unable to Get Data',
                })
              ).subscribe({
                next: (res: any) => {
                    this.selectedExchangeDetails = res.tickers;
                    this.selectedExchangeName = res.name + ' (' + res.country + ')' + ' ' + res.year_established;
                    this.selectedExchangeImageUrl = res.image;
                },
                error: (err) => {
                    console.error('Error fetching crypto stats: ', err);
                }
            });
            this.loading = false;
        }
    }



    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

}

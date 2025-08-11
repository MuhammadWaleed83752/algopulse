import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environement';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private apiUrlCryptos = `${environment.apiBaseUrl}/crypto`;
  private apiUrlcryptosStats = `${environment.apiBaseUrl}/cryptosStats`;
  private apiUrlExchanges = `${environment.apiBaseUrl}/exchangesTop`;
  private apiUrlExchangeDetails = `${environment.apiBaseUrl}/exchangesDetails`;


  constructor(private http: HttpClient) { }

  getCryptos(limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrlCryptos}?limit=${limit}`);
  }

  getCryptoStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlcryptosStats}`);
  }

  getExchanges(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlExchanges}`);
  }

  getExchangeDetails(selectedExchangeId: string): Observable<any> {
    return this.http.get<any>(this.apiUrlExchangeDetails + `/${selectedExchangeId}`);
  }
  
}

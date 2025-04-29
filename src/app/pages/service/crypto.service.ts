import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private apiUrlCryptos = 'http://localhost:8000/api/cryptos';
  private apiUrlcryptosStats = 'http://localhost:8000/api/cryptosStats';
  private apiUrlExchanges = 'http://localhost:8000/api/exchangesTop';
  private apiUrlExchangeDetails = 'http://localhost:8000/api/exchangesDetails';


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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environement';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  
    // private apiUrl = 'http://localhost:8000/get-vector-tiles';

    private apiUrlVectorTiles = `${environment.apiBaseUrl}/get-vector-tiles`;
    private apiUrlVectorRoads = `${environment.apiBaseUrl}/get-vector-tiles-roads`;
    private apiUrlVectorPois = `${environment.apiBaseUrl}/get-vector-tiles-pois`;

    // private apiUrlRoads = 'http://localhost:8000/get-vector-tiles-roads';

  constructor(private http: HttpClient) {}

  getVectorTiles(): Observable<string> {
    return this.http.get<string>(this.apiUrlVectorTiles);
  }

  getVectorTilesRoads(): Observable<string> {
    return this.http.get<string>(this.apiUrlVectorRoads);
  }

  getVectorTilesPois(): Observable<string> {
    return this.http.get<string>(this.apiUrlVectorPois);
  }
}
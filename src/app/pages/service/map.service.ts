import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
    private apiUrl = 'http://localhost:8000/get-vector-tiles';

    private apiUrlRoads = 'http://localhost:8000/get-vector-tiles-roads';

  constructor(private http: HttpClient) {}

  getVectorTiles(): Observable<string> {
    return this.http.get<string>(this.apiUrl);
  }

  getVectorTilesRoads(): Observable<string> {
    return this.http.get<string>(this.apiUrlRoads);
  }
}
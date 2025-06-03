import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../../service/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    ToastModule,
    CommonModule
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class Maps implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/dark-v10';
  center: [number, number] = [46.6753, 24.7136];
  constructor(private mapService: MapService) { }
  vectorTileUrl: string = '';
  currentMode: 'light' | 'dark' = 'dark';
  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoibXVoYW1tYWR3YWxlZWQxMTIyIiwiYSI6ImNtYWR3amEyczAxNXIyanNmeWVoYjl0N2MifQ.zG8v86Wtb4BTdrF02n5qMw',
      container: 'map',
      style: this.style,
      zoom: 13,

      center: this.center,
      projection: 'globe'
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Load vector tile URL once
    this.mapService.getVectorTilesRoads().subscribe({
      next: (url: string) => {
        this.vectorTileUrl = url;
        this.map?.on('load', () => {
          this.addVectorTilesRoads(); // Initial call after map load
        });
      },
      error: (err) => console.error('Failed to load vector tiles:', err),
    });
  }

  private addVectorTilesRoads(): void {
    if (!this.map || !this.vectorTileUrl) return;

    if (this.map.getSource('roads-tiles')) return; // Avoid duplicates

    this.map.addSource('roads-tiles', {
      type: 'vector',
      tiles: [this.vectorTileUrl],
      minzoom: 0,
      maxzoom: 14,
    });

    // Add motorways below labels
    this.map.addLayer(
      {
        id: 'motorways',
        type: 'line',
        source: 'roads-tiles',
        'source-layer': 'public.riyadh_roads',
        filter: ['in', 'highway', 'motorway', 'motorway_link', 'trunk', 'trunk_link', 'primary', 'primary_link'],
        paint: {
          'line-color': '#e65100',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1.5, 18, 6],
        },
      },
      'road-label' // Add below the 'road-label' layer
    );

    // Add primary roads below labels
    this.map.addLayer(
      {
        id: 'primary-roads',
        type: 'line',
        source: 'roads-tiles',
        'source-layer': 'public.riyadh_roads',
        filter: ['in', 'highway', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link', 'unclassified'],
        paint: {
          'line-color': '#f9a825',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 18, 4],
        },
        minzoom: 14,
      },
      'road-label' // Add below the 'road-label' layer
    );

    // Add residential roads below labels
    this.map.addLayer(
      {
        id: 'residential-roads',
        type: 'line',
        source: 'roads-tiles',
        'source-layer': 'public.riyadh_roads',
        filter: ['in', 'highway', 'residential', 'living_street', 'service', 'services', 'road'],
        paint: {
          'line-color': '#7a7c7c',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 18, 4],
        },
        minzoom: 12,
      },
      'road-label' // Add below the 'road-label' layer
    );
  }


  setLightMode(): void {
    if (this.map) {
      this.map.setStyle('mapbox://styles/mapbox/streets-v12');
      this.map.once('style.load', () => {
        // Wait until tileset is fully ready before calling
        setTimeout(() => this.addVectorTilesRoads(), 100);
      });
      this.currentMode = 'light';
    }
  }

  setDarkMode(): void {
    if (this.map) {
      this.map.setStyle('mapbox://styles/mapbox/dark-v10');
      this.map.once('style.load', () => {
        setTimeout(() => this.addVectorTilesRoads(), 100);
      });
      this.currentMode = 'dark';
    }
  }

  // setSatelliteMode(): void {
  //   if (this.map) {
  //     this.map.setStyle('mapbox://styles/mapbox/satellite-v9');
  //     this.map.once('style.load', () => {
  //       setTimeout(() => this.addVectorTilesRoads(), 100);
  //     });
  //   }
  // }


}

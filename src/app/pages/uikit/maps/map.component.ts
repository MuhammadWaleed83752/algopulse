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
  vectorTileUrl: string = '';
  vectorTilePoiUrl: string = '';
  center: [number, number] = [46.6753, 24.7136];
  currentMode: 'light' | 'dark' | 'osm' = 'osm';

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoibXVoYW1tYWR3YWxlZWQxMTIyIiwiYSI6ImNtYWR3amEyczAxNXIyanNmeWVoYjl0N2MifQ.zG8v86Wtb4BTdrF02n5qMw',
      container: 'map',
      style: 'https://api.maptiler.com/maps/openstreetmap/style.json?key=6NZ70ahtyfXGNJv2av9P',
      center: this.center,
      zoom: 13,
      projection: 'globe',
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    this.mapService.getVectorTilesRoads().subscribe({
      next: (url: string) => {
        this.vectorTileUrl = url;
        this.map?.on('load', () => {
          this.addVectorTilesRoads();
        });
      },
      error: (err) => console.error('Failed to load vector tiles:', err),
    });

    this.mapService.getVectorTilesPois().subscribe({
      next: (url: string) => {
        this.vectorTilePoiUrl = url;
        this.map?.on('load', () => {
          this.addVectorTilesPois();
        });
      },
      error: (err) => console.error('Failed to load vector tiles (POIs):', err),
    });
  }

  private addVectorTilesRoads(): void {
    if (!this.map || !this.vectorTileUrl) return;
    if (this.map.getSource('roads-tiles')) return;

    this.map.addSource('roads-tiles', {
      type: 'vector',
      tiles: [this.vectorTileUrl],
      minzoom: 0,
      maxzoom: 14,
    });

    // Motorways: orange
    this.map.addLayer({
      id: 'motorways',
      type: 'line',
      source: 'roads-tiles',
      'source-layer': 'public.riyadh_roads',
      filter: ['in', 'highway', 'motorway', 'motorway_link'],
      paint: {
        'line-color': '#ff7e00',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 18, 4],
      },
    });

    // Primary roads: yellow
    this.map.addLayer({
      id: 'primary-roads',
      type: 'line',
      source: 'roads-tiles',
      'source-layer': 'public.riyadh_roads',
      filter: ['in', 'highway', 'primary', 'primary_link'],
      paint: {
        'line-color': '#ffcc00',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.3, 18, 3],
      },
    });

    // Secondary roads: light yellow
    this.map.addLayer({
      id: 'secondary-roads',
      type: 'line',
      source: 'roads-tiles',
      'source-layer': 'public.riyadh_roads',
      filter: ['in', 'highway', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link'],
      paint: {
        'line-color': '#ffff99',
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 18, 2.5],
      },
      minzoom: 12,
    });

    // Residential roads: light gray
    this.map.addLayer({
      id: 'residential-roads',
      type: 'line',
      source: 'roads-tiles',
      'source-layer': 'public.riyadh_roads',
      filter: ['in', 'highway', 'residential', 'living_street', 'service', 'services', 'road', 'unclassified'],
      paint: {
        'line-color': '#cccccc',
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 18, 2],
      },
      minzoom: 12,
    });
    const layers = this.map.getStyle().layers!;
    const roadLabelLayer = layers.find(layer =>
      layer.type === 'symbol' &&
      layer.layout &&
      typeof layer.layout['text-field'] === 'string' &&
      layer.layout['text-field'].includes('name') &&
      layer.id.toLowerCase().includes('road')
    );

    console.log('Found road label layer:', roadLabelLayer?.id);
  }

  setOSMMode(): void {
    if (this.map) {
      this.map.setStyle('https://api.maptiler.com/maps/openstreetmap/style.json?key=6NZ70ahtyfXGNJv2av9P');
      this.map.once('style.load', () => {
        setTimeout(() => {
          this.addVectorTilesRoads();
          this.addVectorTilesPois();
        }, 100);
      });
      this.currentMode = 'osm';
    }
  }

  setLightMode(): void {
    if (this.map) {
      this.map.setStyle('mapbox://styles/mapbox/streets-v12');
      this.map.once('style.load', () => {
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

  private addVectorTilesPois(): void {
    if (!this.map || !this.vectorTilePoiUrl) return;

    if (this.map.getSource('poi-tiles')) return;

    this.map.addSource('poi-tiles', {
      type: 'vector',
      tiles: [this.vectorTilePoiUrl],
      minzoom: 0,
      maxzoom: 16,
    });
    const markerUrl = '/assets/icons/osm-marker.png';
    this.map.loadImage(markerUrl, (error, image) => {
      if (error || !image) {
        console.error('Failed to load POI marker image:', error);
        return;
      }

      if (!this.map!.hasImage('custom-poi-marker')) {
        this.map!.addImage('custom-poi-marker', image);
      }

      this.map!.addLayer({
        id: 'poi-layer',
        type: 'symbol',
        source: 'poi-tiles',
        'source-layer': 'public.riyadh_pois',
        layout: {
          'icon-image': 'custom-poi-marker',
          'icon-size': 0.7,
          'icon-allow-overlap': true,
        },
        filter: [
          'in', 'amenity',
          'hospital', 'school', 'university', 'mosque',
          'police', 'government', 'townhall',
          'hotel', 'museum', 'library', 'bank'
        ]
      });
    });

  }
}

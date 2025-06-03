import { Component, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    templateUrl: './app.topbar.html',
})
export class AppTopbar {
    items!: MenuItem[];

    dropdownOpen: boolean = false;

    constructor(private authService: AuthService, public layoutService: LayoutService, private router: Router) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
      }
    
      closeDropdown() {
        this.dropdownOpen = false;
      }

      signOut() {
        this.closeDropdown();
        this.authService.logout();
      }


    // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.layout-topbar-action') && !target.closest('.relative')) {
      this.closeDropdown();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environement';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl; // Your FastAPI backend

  constructor(private http: HttpClient, private router: Router) {}

  signup(userData: any) {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  login(user: { username: string; password: string }) {
    return this.http.post(`${this.baseUrl}/login`, user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    // this.toastr.info('Logged out');
    this.router.navigate(['/auth/login']);
  }
}

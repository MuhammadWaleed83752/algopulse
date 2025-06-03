import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.component.html'
})
export class Login {

    constructor(private authService: AuthService, private router: Router, private toast: HotToastService) {}

    username: string = '';

    password: string = '';

    checked: boolean = false;

    // signin.component.ts
onLogin() {

    const credentials = {
        username: this.username,
        password: this.password
    };

    this.authService.login(credentials).pipe(
      this.toast.observe({
        success: 'Signed In Successfully!',
        error: 'Invalid Credentials',
        loading: 'Signing In...',
      })
    ).subscribe({
      next: (res: any) => {
        this.authService.setToken(res.access_token);
        // console.log('Login successful', res.detail);
        // this.toastr.success('Login successful');
        this.router.navigate(['/']);
      },
      error: (err) => console.log(err.error.detail, ' Login failed'),
    });
  }
}

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
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './signup.component.html'
})
export class Signup {

    constructor(private authService: AuthService, private router: Router, private toast: HotToastService) {}

    email: string = '';
    
    username: string = '';

    password: string = '';


    onSignup() {
        const newUser = {
            email: this.email,
            username: this.username,
            password: this.password
        };
    
        this.authService.signup(newUser).pipe(
            this.toast.observe({
              success: 'User Created Successfully!',
              error: 'User Already Exists!',
              loading: 'Loading...',
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

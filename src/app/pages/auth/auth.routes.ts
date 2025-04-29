import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login/login.component';
import { Error } from './error';
import { Signup } from './signup/signup.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup }
] as Routes;

import { Routes } from '@angular/router';
import { CaptchaScreenComponent } from './pages/captcha-screen/captcha-screen.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { logoutGuard } from './guards/logout.guard';

export const routes: Routes = [
    {path:'',canActivate:[authGuardGuard],component:CaptchaScreenComponent},
    {path:"login",canActivate:[logoutGuard],component:LoginComponent},
    {path:"register",canActivate:[logoutGuard],component:RegisterComponent},
    {path:"home",canActivate:[authGuardGuard],component:HomeComponent},
    {path:"callback",canActivate:[logoutGuard],component:CallbackComponent},
];

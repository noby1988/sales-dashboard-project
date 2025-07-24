import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SalesDataComponent } from './components/sales-data/sales-data.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sales',
    component: SalesDataComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/home' },
];

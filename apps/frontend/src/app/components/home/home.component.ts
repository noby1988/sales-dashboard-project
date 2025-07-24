import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../../store/auth/auth.actions';
import * as SalesActions from '../../store/sales/sales.actions';
import {
  selectUser,
  selectSalesSummary,
  selectLoadingSummary,
} from '../../store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.store.select(selectUser);
  salesSummary$ = this.store.select(selectSalesSummary);
  isLoading$ = this.store.select(selectLoadingSummary);

  public ngOnInit() {
    this.store.dispatch(SalesActions.loadSalesSummary());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  viewSalesData() {
    this.router.navigate(['/sales']);
  }

  viewAnalytics() {
    this.router.navigate(['/analytics']);
  }

  exportData() {
    // TODO: Implement data export functionality
    console.log('Export data functionality');
  }
}

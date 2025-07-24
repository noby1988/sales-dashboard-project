import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

interface SalesSummary {
  totalRecords: number;
  totalRevenue: number;
  totalProfit: number;
  regions: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  salesSummary: SalesSummary | null = null;
  isLoading = true;

  private authService = inject(AuthService);

  ngOnInit() {
    this.loadUserInfo();
    this.loadSalesSummary();
  }

  private loadUserInfo() {
    this.user = this.authService.getCurrentUser();
  }

  private async loadSalesSummary() {
    try {
      const response = await fetch('http://localhost:3000/api/sales/summary');
      if (response.ok) {
        this.salesSummary = await response.json();
      }
    } catch (error) {
      console.error('Error loading sales summary:', error);
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.authService.logout();
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
    // TODO: Navigate to sales data page
    console.log('Navigate to sales data page');
  }

  viewAnalytics() {
    // TODO: Navigate to analytics page
    console.log('Navigate to analytics page');
  }

  exportData() {
    // TODO: Implement data export functionality
    console.log('Export data functionality');
  }
}

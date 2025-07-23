import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: any = null;
  salesSummary: any = null;
  isLoading = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadUserInfo();
    this.loadSalesSummary();
  }

  private checkAuthentication() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
  }

  private loadUserInfo() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
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

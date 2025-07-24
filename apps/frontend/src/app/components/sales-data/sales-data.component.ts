import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SalesQuery } from '../../services/sales.service';
import * as SalesActions from '../../store/sales/sales.actions';
import {
  selectSalesRecords,
  selectTotalRecords,
  selectCurrentPage,
  selectPageSize,
  selectLoadingRecords,
  selectErrorRecords,
  selectAvailableRegions,
  selectAvailableCountries,
  selectAvailableItemTypes,
  selectAvailableSalesChannels,
  selectFilters,
  selectPaginationInfo,
} from '../../store/sales/sales.selectors';

@Component({
  selector: 'app-sales-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-data.component.html',
  styleUrls: ['./sales-data.component.scss'],
})
export class SalesDataComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Observables from store
  salesRecords$ = this.store.select(selectSalesRecords);
  totalRecords$ = this.store.select(selectTotalRecords);
  currentPage$ = this.store.select(selectCurrentPage);
  pageSize$ = this.store.select(selectPageSize);
  isLoading$ = this.store.select(selectLoadingRecords);
  errorMessage$ = this.store.select(selectErrorRecords);
  availableRegions$ = this.store.select(selectAvailableRegions);
  availableCountries$ = this.store.select(selectAvailableCountries);
  availableItemTypes$ = this.store.select(selectAvailableItemTypes);
  availableSalesChannels$ = this.store.select(selectAvailableSalesChannels);
  filters$ = this.store.select(selectFilters);
  paginationInfo$ = this.store.select(selectPaginationInfo);

  // Local filter state
  filters: SalesQuery = {};

  // Make Math available in template
  protected Math = Math;

  // Computed properties for template
  get totalPages(): number {
    let totalPages = 0;
    this.totalRecords$.subscribe((total) => {
      this.pageSize$.subscribe((size) => {
        totalPages = Math.ceil(total / size);
      });
    });
    return totalPages;
  }

  get pages(): number[] {
    const pages: number[] = [];
    let totalPages = 0;
    let currentPage = 1;

    this.totalRecords$.subscribe((total) => {
      this.pageSize$.subscribe((size) => {
        totalPages = Math.ceil(total / size);
      });
    });

    this.currentPage$.subscribe((page) => {
      currentPage = page;
    });

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  ngOnInit() {
    // Load initial data
    this.store.dispatch(SalesActions.loadSalesSummary());
    this.store.dispatch(SalesActions.loadSalesRecords({}));
  }

  applyFilters() {
    this.store.dispatch(SalesActions.setFilters({ filters: this.filters }));
  }

  clearFilters() {
    this.filters = {};
    this.store.dispatch(SalesActions.clearFilters());
  }

  onPageChange(page: number) {
    this.store.dispatch(SalesActions.setCurrentPage({ page }));
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US');
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    let totalPages = 0;
    let currentPage = 1;

    this.totalRecords$.subscribe((total) => {
      this.pageSize$.subscribe((size) => {
        totalPages = Math.ceil(total / size);
      });
    });

    this.currentPage$.subscribe((page) => {
      currentPage = page;
    });

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartRecord(): number {
    let currentPage = 1;
    let pageSize = 10;

    this.currentPage$.subscribe((page) => (currentPage = page));
    this.pageSize$.subscribe((size) => (pageSize = size));

    return (currentPage - 1) * pageSize + 1;
  }

  getEndRecord(): number {
    let currentPage = 1;
    let pageSize = 10;
    let totalRecords = 0;

    this.currentPage$.subscribe((page) => (currentPage = page));
    this.pageSize$.subscribe((size) => (pageSize = size));
    this.totalRecords$.subscribe((total) => (totalRecords = total));

    return Math.min(currentPage * pageSize, totalRecords);
  }

  getPreviousPage(): number {
    let currentPage = 1;
    this.currentPage$.subscribe((page) => (currentPage = page));
    return currentPage - 1;
  }

  getNextPage(): number {
    let currentPage = 1;
    this.currentPage$.subscribe((page) => (currentPage = page));
    return currentPage + 1;
  }

  isFirstPage(): boolean {
    let currentPage = 1;
    this.currentPage$.subscribe((page) => (currentPage = page));
    return currentPage === 1;
  }

  isLastPage(): boolean {
    let currentPage = 1;
    let totalRecords = 0;
    let pageSize = 10;

    this.currentPage$.subscribe((page) => (currentPage = page));
    this.totalRecords$.subscribe((total) => (totalRecords = total));
    this.pageSize$.subscribe((size) => (pageSize = size));

    return currentPage === Math.ceil(totalRecords / pageSize);
  }
}

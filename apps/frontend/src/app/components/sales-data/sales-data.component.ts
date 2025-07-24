import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { SalesQuery, SalesRecord } from '../../services/sales.service';
import * as SalesActions from '../../store/sales/sales.actions';
import * as AuthActions from '../../store/auth/auth.actions';
import {
  selectSalesRecords,
  selectTotalRecords,
  selectCurrentOffset,
  selectPageSize,
  selectLoadingRecords,
  selectLoadingMoreRecords,
  selectHasMoreRecords,
  selectMaxStoredRecords,
  selectErrorRecords,
  selectAvailableRegions,
  selectAvailableCountries,
  selectAvailableItemTypes,
  selectAvailableSalesChannels,
  selectFilters,
} from '../../store/sales/sales.selectors';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-sales-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-data.component.html',
  styleUrls: ['./sales-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesDataComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Observables from store
  salesRecords$ = this.store.select(selectSalesRecords);
  totalRecords$ = this.store.select(selectTotalRecords);
  currentOffset$ = this.store.select(selectCurrentOffset);
  pageSize$ = this.store.select(selectPageSize);
  maxStoredRecords$ = this.store.select(selectMaxStoredRecords);
  isLoading$ = this.store.select(selectLoadingRecords);
  isLoadingMore$ = this.store.select(selectLoadingMoreRecords);
  hasMoreRecords$ = this.store.select(selectHasMoreRecords);
  errorMessage$ = this.store.select(selectErrorRecords);
  availableRegions$ = this.store.select(selectAvailableRegions);
  availableCountries$ = this.store.select(selectAvailableCountries);
  availableItemTypes$ = this.store.select(selectAvailableItemTypes);
  availableSalesChannels$ = this.store.select(selectAvailableSalesChannels);
  filters$ = this.store.select(selectFilters);

  // Computed observables for cleaner templates
  isNotLoading$ = this.isLoading$.pipe(map((loading) => !loading));
  hasNoMoreRecords$ = this.hasMoreRecords$.pipe(map((hasMore) => !hasMore));
  hasRecords$ = this.salesRecords$.pipe(
    map((records) => records && records.length > 0)
  );
  hasNoRecords$ = this.salesRecords$.pipe(
    map((records) => !records || records.length === 0)
  );
  showDataSection$ = combineLatest([this.isLoading$, this.salesRecords$]).pipe(
    map(
      ([loading, records]) => loading === false && records && records.length > 0
    )
  );
  showEmptyState$ = combineLatest([this.isLoading$, this.salesRecords$]).pipe(
    map(
      ([loading, records]) =>
        loading === false && (!records || records.length === 0)
    )
  );

  // Local filter state
  filters: SalesQuery = {};

  // Local state for infinite scrolling
  currentOffset = 0;
  pageSize = 20;
  maxStoredRecords = 200;

  // Make Math available in template
  protected Math = Math;

  // TrackBy function to prevent unnecessary re-rendering
  trackByRecordId(index: number, record: SalesRecord): string {
    return record.orderId;
  }

  // Simple infinite scrolling
  onScroll(event: any) {
    const element = event.target;

    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100; // 100px threshold

    if (atBottom && !this.isLoadingMore && this.hasMoreRecords) {
      this.loadMoreRecords();
    }
  }

  private get isLoadingMore(): boolean {
    let loading = false;
    this.isLoadingMore$.subscribe((val) => (loading = val));
    return loading;
  }

  private get hasMoreRecords(): boolean {
    let hasMore = false;
    this.hasMoreRecords$.subscribe((val) => (hasMore = val));
    return hasMore;
  }

  ngOnInit() {
    // Check if user is authenticated, if not, auto-login with test credentials
    this.store.select(selectIsAuthenticated).subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        // Auto-login with test credentials for development
        this.store.dispatch(
          AuthActions.login({
            username: 'admin',
            password: 'password',
          })
        );
      }
    });

    // Load initial data
    this.store.dispatch(SalesActions.loadSalesSummary());
    this.store.dispatch(SalesActions.loadSalesRecords({}));

    // Subscribe to observables to update local state
    this.currentOffset$.subscribe((offset) => (this.currentOffset = offset));
    this.pageSize$.subscribe((size) => (this.pageSize = size));
    this.maxStoredRecords$.subscribe((max) => (this.maxStoredRecords = max));
  }

  applyFilters() {
    this.store.dispatch(SalesActions.setFilters({ filters: this.filters }));
  }

  clearFilters() {
    this.filters = {};
    this.store.dispatch(SalesActions.clearFilters());
  }

  loadMoreRecords() {
    if (this.filters) {
      const query = {
        ...this.filters,
        offset: this.currentOffset + this.pageSize,
        limit: this.pageSize,
      };
      this.store.dispatch(SalesActions.loadMoreSalesRecords({ query }));
    }
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
}

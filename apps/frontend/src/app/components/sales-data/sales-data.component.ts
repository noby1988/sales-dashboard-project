import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, debounceTime, takeUntil } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
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
export class SalesDataComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

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

  // Computed observables for table header to reduce async pipes
  tableInfo$ = combineLatest([
    this.salesRecords$,
    this.totalRecords$,
    this.maxStoredRecords$,
  ]).pipe(
    map(([records, total, maxStored]) => ({
      recordsCount: records?.length || 0,
      totalRecords: total || 0,
      maxStored: maxStored || 200,
    }))
  );

  // Local filter state
  filters: SalesQuery = {};

  // Local state for infinite scrolling
  currentOffset = 0;
  pageSize = 20;
  maxStoredRecords = 200;
  private isLoadingMore = false;
  private hasMoreRecords = false;
  private scrollTriggered = false;
  private scrollContainer: HTMLElement | null = null;
  private scrollTimeout: any = null;

  // Make Math available in template
  protected Math = Math;

  // TrackBy function to prevent unnecessary re-rendering
  trackByRecordId(index: number, record: SalesRecord): string {
    return record.orderId;
  }

  // Improved infinite scrolling with debouncing and state management
  onScroll(event: any) {
    const element = event.target;

    // Debounce scroll events to prevent excessive calls
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Process scroll with a small delay to ensure smooth scrolling
    this.scrollTimeout = setTimeout(() => {
      this.processScroll(element);
    }, 50);
  }

  private processScroll(element: HTMLElement) {
    this.scrollContainer = element;

    // More precise bottom detection - check if we're within 50px of the bottom
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    const atBottom = scrollHeight - scrollPosition <= 50;

    // Only trigger if we're at the bottom, not already loading, have more records, and haven't triggered recently
    if (
      atBottom &&
      !this.scrollTriggered &&
      !this.isLoadingMore &&
      this.hasMoreRecords
    ) {
      this.scrollTriggered = true;
      this.loadMoreRecords();

      // Reset the flag after loading completes or timeout
      setTimeout(() => {
        this.scrollTriggered = false;
      }, 1500);
    }
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

    // Subscribe to observables to update local state with proper cleanup
    this.currentOffset$
      .pipe(takeUntil(this.destroy$))
      .subscribe((offset) => (this.currentOffset = offset));
    this.pageSize$
      .pipe(takeUntil(this.destroy$))
      .subscribe((size) => (this.pageSize = size));
    this.maxStoredRecords$
      .pipe(takeUntil(this.destroy$))
      .subscribe((max) => (this.maxStoredRecords = max));

    // Subscribe to loading and hasMore states for infinite scroll
    this.isLoadingMore$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.isLoadingMore = loading;
      // Reset scroll trigger when loading completes
      if (!loading) {
        this.scrollTriggered = false;
      }
    });
    this.hasMoreRecords$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasMore) => (this.hasMoreRecords = hasMore));
  }

  ngOnDestroy() {
    // Clear any pending timeouts
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.destroy$.next();
    this.destroy$.complete();
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

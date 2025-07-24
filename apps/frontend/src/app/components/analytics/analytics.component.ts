import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as SalesActions from '../../store/sales/sales.actions';
import {
  selectSalesRecords,
  selectTotalRecords,
  selectLoadingRecords,
  selectErrorRecords,
} from '../../store/sales/sales.selectors';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

interface ChartData {
  name: string;
  value: number;
}

interface RegionData {
  name: string;
  series: ChartData[];
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // Observables from store
  salesRecords$ = this.store.select(selectSalesRecords);
  totalRecords$ = this.store.select(selectTotalRecords);
  isLoading$ = this.store.select(selectLoadingRecords);
  errorMessage$ = this.store.select(selectErrorRecords);

  // Chart data observables
  regionData$ = this.salesRecords$.pipe(
    map((records) => this.processRegionData(records || []))
  );

  itemTypeData$ = this.salesRecords$.pipe(
    map((records) => this.processItemTypeData(records || []))
  );

  salesChannelData$ = this.salesRecords$.pipe(
    map((records) => this.processSalesChannelData(records || []))
  );

  monthlyRevenueData$ = this.salesRecords$.pipe(
    map((records) => this.processMonthlyRevenueData(records || []))
  );

  profitByRegionData$ = this.salesRecords$.pipe(
    map((records) => this.processProfitByRegionData(records || []))
  );

  // Computed observables for summary data
  totalRevenue$ = this.salesRecords$.pipe(
    map((records) =>
      records
        ? records.reduce((sum, record) => sum + record.totalRevenue, 0)
        : 0
    )
  );

  totalUnitsSold$ = this.salesRecords$.pipe(
    map((records) =>
      records ? records.reduce((sum, record) => sum + record.unitsSold, 0) : 0
    )
  );

  totalProfit$ = this.salesRecords$.pipe(
    map((records) =>
      records ? records.reduce((sum, record) => sum + record.totalProfit, 0) : 0
    )
  );

  // Chart options
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Category';
  showYAxisLabel = true;
  yAxisLabel = 'Value';

  // Color scheme
  colorScheme = 'cool';

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

    // Load sales data if not already loaded
    this.store.dispatch(SalesActions.loadSalesRecords({}));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Process data for region pie chart
  private processRegionData(records: any[]): ChartData[] {
    const regionMap = new Map<string, number>();

    records.forEach((record) => {
      const region = record.region;
      const revenue = record.totalRevenue;
      regionMap.set(region, (regionMap.get(region) || 0) + revenue);
    });

    return Array.from(regionMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }

  // Process data for item type bar chart
  private processItemTypeData(records: any[]): ChartData[] {
    const itemTypeMap = new Map<string, number>();

    records.forEach((record) => {
      const itemType = record.itemType;
      const unitsSold = record.unitsSold;
      itemTypeMap.set(itemType, (itemTypeMap.get(itemType) || 0) + unitsSold);
    });

    return Array.from(itemTypeMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }

  // Process data for sales channel pie chart
  private processSalesChannelData(records: any[]): ChartData[] {
    const channelMap = new Map<string, number>();

    records.forEach((record) => {
      const channel = record.salesChannel;
      const revenue = record.totalRevenue;
      channelMap.set(channel, (channelMap.get(channel) || 0) + revenue);
    });

    return Array.from(channelMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }

  // Process data for monthly revenue line chart
  private processMonthlyRevenueData(records: any[]): RegionData[] {
    const monthlyMap = new Map<string, number>();

    records.forEach((record) => {
      const date = new Date(record.orderDate);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      const revenue = record.totalRevenue;
      monthlyMap.set(monthYear, (monthlyMap.get(monthYear) || 0) + revenue);
    });

    const sortedMonths = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({ name, value: Math.round(value) }));

    return [
      {
        name: 'Monthly Revenue',
        series: sortedMonths,
      },
    ];
  }

  // Process data for profit by region bar chart
  private processProfitByRegionData(records: any[]): ChartData[] {
    const regionMap = new Map<string, number>();

    records.forEach((record) => {
      const region = record.region;
      const profit = record.totalProfit;
      regionMap.set(region, (regionMap.get(region) || 0) + profit);
    });

    return Array.from(regionMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

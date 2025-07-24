import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesRecord {
  region: string;
  country: string;
  itemType: string;
  salesChannel: string;
  orderPriority: string;
  orderDate: string;
  orderId: string;
  shipDate: string;
  unitsSold: number;
  unitPrice: number;
  unitCost: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

export interface SalesQuery {
  region?: string;
  country?: string;
  itemType?: string;
  salesChannel?: string;
  orderPriority?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface SalesResponse {
  data: SalesRecord[];
  total: number;
  limit: number;
  offset: number;
}

export interface SalesSummary {
  totalRecords: number;
  totalRevenue: number;
  totalProfit: number;
  regions: string[];
  countries: string[];
  itemTypes: string[];
  salesChannels: string[];
}

export interface SalesByRegion {
  region: string;
  revenue: number;
  profit: number;
  count: number;
}

export interface SalesByItemType {
  itemType: string;
  revenue: number;
  profit: number;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly API_URL = 'http://localhost:3000/api/sales';

  private http = inject(HttpClient);

  /**
   * Get sales records with optional filtering and pagination
   */
  getSalesRecords(query: SalesQuery = {}): Observable<SalesResponse> {
    let params = new HttpParams();

    // Add query parameters
    if (query.region) {
      params = params.set('region', query.region);
    }
    if (query.country) {
      params = params.set('country', query.country);
    }
    if (query.itemType) {
      params = params.set('itemType', query.itemType);
    }
    if (query.salesChannel) {
      params = params.set('salesChannel', query.salesChannel);
    }
    if (query.orderPriority) {
      params = params.set('orderPriority', query.orderPriority);
    }
    if (query.startDate) {
      params = params.set('startDate', query.startDate);
    }
    if (query.endDate) {
      params = params.set('endDate', query.endDate);
    }
    if (query.limit) {
      params = params.set('limit', query.limit.toString());
    }
    if (query.offset) {
      params = params.set('offset', query.offset.toString());
    }

    return this.http.get<SalesResponse>(`${this.API_URL}`, { params });
  }

  /**
   * Get sales summary statistics
   */
  getSalesSummary(): Observable<SalesSummary> {
    return this.http.get<SalesSummary>(`${this.API_URL}/summary`);
  }

  /**
   * Get sales data aggregated by region
   */
  getSalesByRegion(): Observable<SalesByRegion[]> {
    return this.http.get<SalesByRegion[]>(`${this.API_URL}/by-region`);
  }

  /**
   * Get sales data aggregated by item type
   */
  getSalesByItemType(): Observable<SalesByItemType[]> {
    return this.http.get<SalesByItemType[]>(`${this.API_URL}/by-item-type`);
  }

  /**
   * Get all sales records (unpaginated)
   */
  getAllSalesRecords(): Observable<SalesRecord[]> {
    return this.http.get<SalesRecord[]>(`${this.API_URL}`);
  }

  /**
   * Get sales records for a specific region
   */
  getSalesByRegionFilter(region: string): Observable<SalesResponse> {
    return this.getSalesRecords({ region });
  }

  /**
   * Get sales records for a specific item type
   */
  getSalesByItemTypeFilter(itemType: string): Observable<SalesResponse> {
    return this.getSalesRecords({ itemType });
  }

  /**
   * Get sales records for a specific country
   */
  getSalesByCountryFilter(country: string): Observable<SalesResponse> {
    return this.getSalesRecords({ country });
  }

  /**
   * Get sales records for a specific sales channel
   */
  getSalesByChannelFilter(salesChannel: string): Observable<SalesResponse> {
    return this.getSalesRecords({ salesChannel });
  }

  /**
   * Get sales records for a date range
   */
  getSalesByDateRange(
    startDate: string,
    endDate: string
  ): Observable<SalesResponse> {
    return this.getSalesRecords({ startDate, endDate });
  }

  /**
   * Get paginated sales records
   */
  getPaginatedSales(page: number, pageSize: number): Observable<SalesResponse> {
    const offset = (page - 1) * pageSize;
    return this.getSalesRecords({ limit: pageSize, offset });
  }
}

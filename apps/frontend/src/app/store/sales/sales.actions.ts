import { createAction, props } from '@ngrx/store';
import {
  SalesRecord,
  SalesQuery,
  SalesSummary,
  SalesByRegion,
  SalesByItemType,
} from '../../services/sales.service';

// Load Sales Records
export const loadSalesRecords = createAction(
  '[Sales] Load Sales Records',
  props<{ query?: SalesQuery }>()
);

export const loadSalesRecordsSuccess = createAction(
  '[Sales] Load Sales Records Success',
  props<{ data: SalesRecord[]; total: number; limit: number; offset: number }>()
);

export const loadSalesRecordsFailure = createAction(
  '[Sales] Load Sales Records Failure',
  props<{ error: any }>()
);

// Load Sales Summary
export const loadSalesSummary = createAction('[Sales] Load Sales Summary');

export const loadSalesSummarySuccess = createAction(
  '[Sales] Load Sales Summary Success',
  props<{ summary: SalesSummary }>()
);

export const loadSalesSummaryFailure = createAction(
  '[Sales] Load Sales Summary Failure',
  props<{ error: any }>()
);

// Load Sales By Region
export const loadSalesByRegion = createAction('[Sales] Load Sales By Region');

export const loadSalesByRegionSuccess = createAction(
  '[Sales] Load Sales By Region Success',
  props<{ data: SalesByRegion[] }>()
);

export const loadSalesByRegionFailure = createAction(
  '[Sales] Load Sales By Region Failure',
  props<{ error: any }>()
);

// Load Sales By Item Type
export const loadSalesByItemType = createAction(
  '[Sales] Load Sales By Item Type'
);

export const loadSalesByItemTypeSuccess = createAction(
  '[Sales] Load Sales By Item Type Success',
  props<{ data: SalesByItemType[] }>()
);

export const loadSalesByItemTypeFailure = createAction(
  '[Sales] Load Sales By Item Type Failure',
  props<{ error: any }>()
);

// Set Current Page
export const setCurrentPage = createAction(
  '[Sales] Set Current Page',
  props<{ page: number }>()
);

// Set Page Size
export const setPageSize = createAction(
  '[Sales] Set Page Size',
  props<{ pageSize: number }>()
);

// Set Filters
export const setFilters = createAction(
  '[Sales] Set Filters',
  props<{ filters: SalesQuery }>()
);

// Clear Filters
export const clearFilters = createAction('[Sales] Clear Filters');

// Load More Sales Records (Infinite Scroll)
export const loadMoreSalesRecords = createAction(
  '[Sales] Load More Sales Records',
  props<{ query?: SalesQuery }>()
);

export const loadMoreSalesRecordsSuccess = createAction(
  '[Sales] Load More Sales Records Success',
  props<{ data: SalesRecord[]; total: number; limit: number; offset: number }>()
);

export const loadMoreSalesRecordsFailure = createAction(
  '[Sales] Load More Sales Records Failure',
  props<{ error: any }>()
);

// Prefetch Sales Records
export const prefetchSalesRecords = createAction(
  '[Sales] Prefetch Sales Records',
  props<{ query?: SalesQuery; direction: 'next' | 'prev' }>()
);

export const prefetchSalesRecordsSuccess = createAction(
  '[Sales] Prefetch Sales Records Success',
  props<{ data: SalesRecord[]; offset: number; direction: 'next' | 'prev' }>()
);

// Virtual Scrolling Management
export const cleanupOldRecords = createAction(
  '[Sales] Cleanup Old Records',
  props<{ currentOffset: number }>()
);

export const jumpToOffset = createAction(
  '[Sales] Jump To Offset',
  props<{ offset: number; query?: SalesQuery }>()
);

// Reset Sales State
export const resetSalesState = createAction('[Sales] Reset State');

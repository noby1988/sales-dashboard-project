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

// Reset Sales State
export const resetSalesState = createAction('[Sales] Reset State');

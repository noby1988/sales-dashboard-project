import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesState } from './sales.state';

// Feature Selector
export const selectSalesState = createFeatureSelector<SalesState>('sales');

// Sales Records Selectors
export const selectSalesRecords = createSelector(
  selectSalesState,
  (state) => state.records
);

export const selectTotalRecords = createSelector(
  selectSalesState,
  (state) => state.totalRecords
);

export const selectCurrentOffset = createSelector(
  selectSalesState,
  (state) => state.currentOffset
);

export const selectPageSize = createSelector(
  selectSalesState,
  (state) => state.pageSize
);

export const selectLoadingMoreRecords = createSelector(
  selectSalesState,
  (state) => state.loadingMoreRecords
);

export const selectHasMoreRecords = createSelector(
  selectSalesState,
  (state) => state.hasMoreRecords
);

export const selectMaxStoredRecords = createSelector(
  selectSalesState,
  (state) => state.maxStoredRecords
);

export const selectLoadingRecords = createSelector(
  selectSalesState,
  (state) => state.loadingRecords
);

export const selectErrorRecords = createSelector(
  selectSalesState,
  (state) => state.errorRecords
);

// Sales Summary Selectors
export const selectSalesSummary = createSelector(
  selectSalesState,
  (state) => state.summary
);

export const selectLoadingSummary = createSelector(
  selectSalesState,
  (state) => state.loadingSummary
);

export const selectErrorSummary = createSelector(
  selectSalesState,
  (state) => state.errorSummary
);

// Sales By Region Selectors
export const selectSalesByRegion = createSelector(
  selectSalesState,
  (state) => state.salesByRegion
);

export const selectLoadingByRegion = createSelector(
  selectSalesState,
  (state) => state.loadingByRegion
);

export const selectErrorByRegion = createSelector(
  selectSalesState,
  (state) => state.errorByRegion
);

// Sales By Item Type Selectors
export const selectSalesByItemType = createSelector(
  selectSalesState,
  (state) => state.salesByItemType
);

export const selectLoadingByItemType = createSelector(
  selectSalesState,
  (state) => state.loadingByItemType
);

export const selectErrorByItemType = createSelector(
  selectSalesState,
  (state) => state.errorByItemType
);

// Filters Selectors
export const selectFilters = createSelector(
  selectSalesState,
  (state) => state.filters
);

// Computed Selectors
export const selectTotalPages = createSelector(
  selectTotalRecords,
  selectPageSize,
  (total, pageSize) => Math.ceil(total / pageSize)
);

export const selectHasRecords = createSelector(
  selectSalesRecords,
  (records) => records.length > 0
);

export const selectIsLoading = createSelector(
  selectLoadingRecords,
  selectLoadingSummary,
  selectLoadingByRegion,
  selectLoadingByItemType,
  (loadingRecords, loadingSummary, loadingByRegion, loadingByItemType) =>
    loadingRecords || loadingSummary || loadingByRegion || loadingByItemType
);

export const selectHasError = createSelector(
  selectErrorRecords,
  selectErrorSummary,
  selectErrorByRegion,
  selectErrorByItemType,
  (errorRecords, errorSummary, errorByRegion, errorByItemType) =>
    errorRecords || errorSummary || errorByRegion || errorByItemType
);

// Filter Options Selectors (from summary)
export const selectAvailableRegions = createSelector(
  selectSalesSummary,
  (summary) => summary?.regions || []
);

export const selectAvailableCountries = createSelector(
  selectSalesSummary,
  (summary) => summary?.countries || []
);

export const selectAvailableItemTypes = createSelector(
  selectSalesSummary,
  (summary) => summary?.itemTypes || []
);

export const selectAvailableSalesChannels = createSelector(
  selectSalesSummary,
  (summary) => summary?.salesChannels || []
);

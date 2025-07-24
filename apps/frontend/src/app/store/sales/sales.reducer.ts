import { createReducer, on } from '@ngrx/store';
import { SalesState, initialState } from './sales.state';
import * as SalesActions from './sales.actions';

export const salesReducer = createReducer(
  initialState,

  // Load Sales Records
  on(SalesActions.loadSalesRecords, (state) => ({
    ...state,
    loadingRecords: true,
    errorRecords: null,
  })),

  on(
    SalesActions.loadSalesRecordsSuccess,
    (state, { data, total, limit, offset }) => ({
      ...state,
      records: data,
      totalRecords: total,
      pageSize: limit,
      currentOffset: offset,
      loadingRecords: false,
      errorRecords: null,
      hasMoreRecords: offset + limit < total,
    })
  ),

  on(SalesActions.loadSalesRecordsFailure, (state, { error }) => ({
    ...state,
    loadingRecords: false,
    errorRecords: error.message || 'Failed to load sales records',
  })),

  // Load More Sales Records
  on(SalesActions.loadMoreSalesRecords, (state) => ({
    ...state,
    loadingMoreRecords: true,
  })),

  on(
    SalesActions.loadMoreSalesRecordsSuccess,
    (state, { data, total, limit, offset }) => {
      const newRecords = [...state.records, ...data];

      // Cleanup old records if we exceed maxStoredRecords
      let cleanedRecords = newRecords;
      if (newRecords.length > state.maxStoredRecords) {
        // Keep the most recent records
        const startIndex = newRecords.length - state.maxStoredRecords;
        cleanedRecords = newRecords.slice(startIndex);
      }

      return {
        ...state,
        records: cleanedRecords,
        totalRecords: total,
        currentOffset: offset,
        loadingMoreRecords: false,
        errorRecords: null,
        hasMoreRecords: offset + limit < total,
      };
    }
  ),

  on(SalesActions.loadMoreSalesRecordsFailure, (state, { error }) => ({
    ...state,
    loadingMoreRecords: false,
    errorRecords: error.message || 'Failed to load more sales records',
  })),

  // Disable cleanup to prevent scroll jumping
  // on(SalesActions.cleanupOldRecords, (state, { currentOffset }) => {
  //   // Cleanup logic disabled for now
  //   return state;
  // }),

  on(SalesActions.jumpToOffset, (state, { offset }) => ({
    ...state,
    records: [], // Clear records when jumping to a new offset
    currentOffset: offset,
    loadingRecords: true,
    errorRecords: null,
  })),

  // Load Sales Summary
  on(SalesActions.loadSalesSummary, (state) => ({
    ...state,
    loadingSummary: true,
    errorSummary: null,
  })),

  on(SalesActions.loadSalesSummarySuccess, (state, { summary }) => ({
    ...state,
    summary,
    loadingSummary: false,
    errorSummary: null,
  })),

  on(SalesActions.loadSalesSummaryFailure, (state, { error }) => ({
    ...state,
    loadingSummary: false,
    errorSummary: error.message || 'Failed to load sales summary',
  })),

  // Load Sales By Region
  on(SalesActions.loadSalesByRegion, (state) => ({
    ...state,
    loadingByRegion: true,
    errorByRegion: null,
  })),

  on(SalesActions.loadSalesByRegionSuccess, (state, { data }) => ({
    ...state,
    salesByRegion: data,
    loadingByRegion: false,
    errorByRegion: null,
  })),

  on(SalesActions.loadSalesByRegionFailure, (state, { error }) => ({
    ...state,
    loadingByRegion: false,
    errorByRegion: error.message || 'Failed to load sales by region',
  })),

  // Load Sales By Item Type
  on(SalesActions.loadSalesByItemType, (state) => ({
    ...state,
    loadingByItemType: true,
    errorByItemType: null,
  })),

  on(SalesActions.loadSalesByItemTypeSuccess, (state, { data }) => ({
    ...state,
    salesByItemType: data,
    loadingByItemType: false,
    errorByItemType: null,
  })),

  on(SalesActions.loadSalesByItemTypeFailure, (state, { error }) => ({
    ...state,
    loadingByItemType: false,
    errorByItemType: error.message || 'Failed to load sales by item type',
  })),

  // Set Current Page
  on(SalesActions.setCurrentPage, (state, { page }) => ({
    ...state,
    currentPage: page,
  })),

  // Set Page Size
  on(SalesActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pageSize,
    currentPage: 1, // Reset to first page when changing page size
  })),

  // Set Filters
  on(SalesActions.setFilters, (state, { filters }) => ({
    ...state,
    filters,
    currentPage: 1, // Reset to first page when applying filters
  })),

  // Clear Filters
  on(SalesActions.clearFilters, (state) => ({
    ...state,
    filters: {},
    currentPage: 1,
  })),

  // Reset State
  on(SalesActions.resetSalesState, () => initialState)
);

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
      currentPage: Math.floor(offset / limit) + 1,
      loadingRecords: false,
      errorRecords: null,
    })
  ),

  on(SalesActions.loadSalesRecordsFailure, (state, { error }) => ({
    ...state,
    loadingRecords: false,
    errorRecords: error.message || 'Failed to load sales records',
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

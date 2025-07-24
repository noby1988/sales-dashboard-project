import {
  SalesRecord,
  SalesQuery,
  SalesSummary,
  SalesByRegion,
  SalesByItemType,
} from '../../services/sales.service';

export interface SalesState {
  // Sales Records with virtual scrolling
  records: SalesRecord[];
  totalRecords: number;
  currentOffset: number;
  pageSize: number;
  maxStoredRecords: number; // Maximum records to keep in memory (disabled for now)
  loadingRecords: boolean;
  loadingMoreRecords: boolean;
  errorRecords: string | null;
  hasMoreRecords: boolean;

  // Sales Summary
  summary: SalesSummary | null;
  loadingSummary: boolean;
  errorSummary: string | null;

  // Sales By Region
  salesByRegion: SalesByRegion[];
  loadingByRegion: boolean;
  errorByRegion: string | null;

  // Sales By Item Type
  salesByItemType: SalesByItemType[];
  loadingByItemType: boolean;
  errorByItemType: string | null;

  // Filters
  filters: SalesQuery;
}

export const initialState: SalesState = {
  // Sales Records with virtual scrolling
  records: [],
  totalRecords: 0,
  currentOffset: 0,
  pageSize: 20,
  maxStoredRecords: 10000, // Increased to prevent cleanup during scrolling
  loadingRecords: false,
  loadingMoreRecords: false,
  errorRecords: null,
  hasMoreRecords: true,

  // Sales Summary
  summary: null,
  loadingSummary: false,
  errorSummary: null,

  // Sales By Region
  salesByRegion: [],
  loadingByRegion: false,
  errorByRegion: null,

  // Sales By Item Type
  salesByItemType: [],
  loadingByItemType: false,
  errorByItemType: null,

  // Filters
  filters: {},
};

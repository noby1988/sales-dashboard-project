import {
  SalesRecord,
  SalesQuery,
  SalesSummary,
  SalesByRegion,
  SalesByItemType,
} from '../../services/sales.service';

export interface SalesState {
  // Sales Records
  records: SalesRecord[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  loadingRecords: boolean;
  errorRecords: string | null;

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
  // Sales Records
  records: [],
  totalRecords: 0,
  currentPage: 1,
  pageSize: 20,
  loadingRecords: false,
  errorRecords: null,

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

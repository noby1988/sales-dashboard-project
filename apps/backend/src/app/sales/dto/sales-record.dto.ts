export class SalesRecordDto {
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

export class SalesQueryDto {
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
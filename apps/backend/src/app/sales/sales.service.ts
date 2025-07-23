import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { SalesRecordDto, SalesQueryDto } from './dto/sales-record.dto';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);
  private salesData: SalesRecordDto[] = [];
  private dataLoaded = false;

  constructor() {
    this.loadSalesData();
  }

  private async loadSalesData(): Promise<void> {
    try {
      const csvPath = path.join(__dirname, './assets/data/sales-records.csv');
      const results: SalesRecordDto[] = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data', (data: any) => {
            // Convert numeric fields
            const record: SalesRecordDto = {
              region: data.Region,
              country: data.Country,
              itemType: data['Item Type'],
              salesChannel: data['Sales Channel'],
              orderPriority: data['Order Priority'],
              orderDate: data['Order Date'],
              orderId: data['Order ID'],
              shipDate: data['Ship Date'],
              unitsSold: parseInt(data['Units Sold'], 10),
              unitPrice: parseFloat(data['Unit Price']),
              unitCost: parseFloat(data['Unit Cost']),
              totalRevenue: parseFloat(data['Total Revenue']),
              totalCost: parseFloat(data['Total Cost']),
              totalProfit: parseFloat(data['Total Profit']),
            };
            results.push(record);
          })
          .on('end', () => {
            this.salesData = results;
            this.dataLoaded = true;
            this.logger.log(`Loaded ${results.length} sales records`);
            resolve();
          })
          .on('error', (error) => {
            this.logger.error('Error loading CSV data:', error);
            reject(error);
          });
      });
    } catch (error) {
      this.logger.error('Error loading sales data:', error);
      throw error;
    }
  }

  async getSalesRecords(query: SalesQueryDto = {}): Promise<{
    data: SalesRecordDto[];
    total: number;
    limit: number;
    offset: number;
  }> {
    if (!this.dataLoaded) {
      await this.loadSalesData();
    }

    let filteredData = [...this.salesData];

    // Apply filters
    if (query.region) {
      filteredData = filteredData.filter((record) =>
        record.region.toLowerCase().includes(query.region.toLowerCase())
      );
    }

    if (query.country) {
      filteredData = filteredData.filter((record) =>
        record.country.toLowerCase().includes(query.country.toLowerCase())
      );
    }

    if (query.itemType) {
      filteredData = filteredData.filter((record) =>
        record.itemType.toLowerCase().includes(query.itemType.toLowerCase())
      );
    }

    if (query.salesChannel) {
      filteredData = filteredData.filter((record) =>
        record.salesChannel
          .toLowerCase()
          .includes(query.salesChannel.toLowerCase())
      );
    }

    if (query.orderPriority) {
      filteredData = filteredData.filter(
        (record) =>
          record.orderPriority.toLowerCase() ===
          query.orderPriority.toLowerCase()
      );
    }

    if (query.startDate || query.endDate) {
      filteredData = filteredData.filter((record) => {
        const orderDate = new Date(record.orderDate);
        const startDate = query.startDate ? new Date(query.startDate) : null;
        const endDate = query.endDate ? new Date(query.endDate) : null;

        if (startDate && endDate) {
          return orderDate >= startDate && orderDate <= endDate;
        } else if (startDate) {
          return orderDate >= startDate;
        } else if (endDate) {
          return orderDate <= endDate;
        }
        return true;
      });
    }

    const total = filteredData.length;
    const offset = query.offset || 0;
    const limit = query.limit || 100;

    // Apply pagination
    const paginatedData = filteredData.slice(offset, offset + limit);

    return {
      data: paginatedData,
      total,
      limit,
      offset,
    };
  }

  async getSalesSummary(): Promise<{
    totalRecords: number;
    totalRevenue: number;
    totalProfit: number;
    regions: string[];
    countries: string[];
    itemTypes: string[];
    salesChannels: string[];
  }> {
    if (!this.dataLoaded) {
      await this.loadSalesData();
    }

    const totalRevenue = this.salesData.reduce(
      (sum, record) => sum + record.totalRevenue,
      0
    );
    const totalProfit = this.salesData.reduce(
      (sum, record) => sum + record.totalProfit,
      0
    );

    const regions = [...new Set(this.salesData.map((record) => record.region))];
    const countries = [
      ...new Set(this.salesData.map((record) => record.country)),
    ];
    const itemTypes = [
      ...new Set(this.salesData.map((record) => record.itemType)),
    ];
    const salesChannels = [
      ...new Set(this.salesData.map((record) => record.salesChannel)),
    ];

    return {
      totalRecords: this.salesData.length,
      totalRevenue,
      totalProfit,
      regions,
      countries,
      itemTypes,
      salesChannels,
    };
  }

  async getSalesByRegion(): Promise<
    { region: string; revenue: number; profit: number; count: number }[]
  > {
    if (!this.dataLoaded) {
      await this.loadSalesData();
    }

    const regionMap = new Map<
      string,
      { revenue: number; profit: number; count: number }
    >();

    this.salesData.forEach((record) => {
      const region = record.region;
      const existing = regionMap.get(region) || {
        revenue: 0,
        profit: 0,
        count: 0,
      };

      regionMap.set(region, {
        revenue: existing.revenue + record.totalRevenue,
        profit: existing.profit + record.totalProfit,
        count: existing.count + 1,
      });
    });

    return Array.from(regionMap.entries()).map(([region, data]) => ({
      region,
      ...data,
    }));
  }

  async getSalesByItemType(): Promise<
    { itemType: string; revenue: number; profit: number; count: number }[]
  > {
    if (!this.dataLoaded) {
      await this.loadSalesData();
    }

    const itemTypeMap = new Map<
      string,
      { revenue: number; profit: number; count: number }
    >();

    this.salesData.forEach((record) => {
      const itemType = record.itemType;
      const existing = itemTypeMap.get(itemType) || {
        revenue: 0,
        profit: 0,
        count: 0,
      };

      itemTypeMap.set(itemType, {
        revenue: existing.revenue + record.totalRevenue,
        profit: existing.profit + record.totalProfit,
        count: existing.count + 1,
      });
    });

    return Array.from(itemTypeMap.entries()).map(([itemType, data]) => ({
      itemType,
      ...data,
    }));
  }
}

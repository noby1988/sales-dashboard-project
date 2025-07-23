import { Controller, Get, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesQueryDto } from './dto/sales-record.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async getSalesRecords(
    @Query('region') region?: string,
    @Query('country') country?: string,
    @Query('itemType') itemType?: string,
    @Query('salesChannel') salesChannel?: string,
    @Query('orderPriority') orderPriority?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const query: SalesQueryDto = {
      region,
      country,
      itemType,
      salesChannel,
      orderPriority,
      startDate,
      endDate,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };

    return this.salesService.getSalesRecords(query);
  }

  @Get('summary')
  async getSalesSummary() {
    return this.salesService.getSalesSummary();
  }

  @Get('by-region')
  async getSalesByRegion() {
    return this.salesService.getSalesByRegion();
  }

  @Get('by-item-type')
  async getSalesByItemType() {
    return this.salesService.getSalesByItemType();
  }
}

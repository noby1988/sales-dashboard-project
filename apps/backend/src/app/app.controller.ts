import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sales-data')
  getData() {
    return this.appService.getData();
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData() {
    return {
      message: 'This is protected data',
      timestamp: new Date().toISOString(),
      service: this.appService.getData(),
    };
  }
}

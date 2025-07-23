import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getSalesData(): { message: string } {
    return { message: 'Sales data' };
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { FuelPriceService } from './fuel-price.service';

@Controller('fuel-price')
export class FuelPriceController {
  constructor(private readonly geocodingService: FuelPriceService) {}

  @Get('reverse')
  async getReverseGeocoding(@Query('lat') lat: string, @Query('lon') lon: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (isNaN(latitude) || isNaN(longitude)) {
      return { error: 'Invalid latitude or longitude' };
    }

    const result = await this.geocodingService.getReverseGeocoding(latitude, longitude);
    return this.geocodingService.createFuelPrice(result.address.state);
  }

  // @Get('scrap')
  // createFuelPrice(@Query('state') state: string) {
  //   const price = this.geocodingService.createFuelPrice(state);
  //   return price;
  // }
}



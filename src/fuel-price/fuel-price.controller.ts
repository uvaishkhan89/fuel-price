import { Controller, Get, Post, Query } from '@nestjs/common';
import { FuelPriceService } from './fuel-price.service';

@Controller('fuel-price')
export class FuelPriceController {
  constructor(private readonly fuelPriceService: FuelPriceService) {}

  // get state name by lat lon
  @Get('reverse')
  async getReverseGeocoding(@Query('lat') lat: string, @Query('lon') lon: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (isNaN(latitude) || isNaN(longitude)) {
      return { error: 'Invalid latitude or longitude' };
    }

    const result = await this.fuelPriceService.getState(latitude, longitude);
    return result.address.state;
  }

  // scrap for single state
  @Get('scrap')
  createFuelPrice(@Query('state') state: string) {
    const price = this.fuelPriceService.createFuelPrice(state);
    return price;
  }

  // scrap for multiple state
  @Post('create-bulk')
  createFuelPriceForAllState() {
    return this.fuelPriceService.createFuelPriceForAllState();
  }
}



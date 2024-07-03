import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { FuelPrice } from './entities/fuel-price.entity';

@Injectable()
export class FuelPriceService {

  private readonly logger = new Logger(FuelPriceService.name);

  constructor(private readonly httpService: HttpService) {}

  async getReverseGeocoding(lat: number, lon: number) {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    const apiUrl = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json&`;
    
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching geocoding data');
    }
  }
  
  
  async createFuelPrice(stateName: string = 'uttar pradesh') {
    const state = stateName.replace(/\s+/g, '-');
    const petrolPrice = await this.getFuelPrices('petrol', state);
    const dieselPrice = await this.getFuelPrices('diesel', state);
    const data = {
      state: stateName,
      petrolPrice: petrolPrice.fuelPrice,
      dieselPrice: dieselPrice.fuelPrice
    }
    return FuelPrice.create(data);
  }

  async getFuelPrices(fuelName: string, state: string): Promise<any> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.ndtv.com/fuel-prices/${fuelName}-price-in-${state}-state`, {
      waitUntil: 'networkidle2',
    });

    const pageContent = await page.content();

    const fuelPrices = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      const columns = rows[1].querySelectorAll('td');
      return {fuelPrice: columns[1]?.innerText.trim()};
    });

    await browser.close();
    return fuelPrices;
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async hello() {
    console.log('Hello Uvaish khan');
  }
}
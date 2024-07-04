import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { FuelPrice } from './entities/fuel-price.entity';
import { InjectModel } from '@nestjs/sequelize';
import { State } from '../state/entities/state.entity';
@Injectable()
export class FuelPriceService {
  private readonly logger = new Logger(FuelPriceService.name);

  constructor(
    @InjectModel(FuelPrice) private readonly fuelPrice: typeof FuelPrice,
    @InjectModel(State) private readonly state: typeof State
  ) {}

  async getState(lat: number, lon: number) {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    const apiUrl = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json&`;
    
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching geocoding data');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  async createFuelPriceForAllState() {
    const states = await this.state.findAll();
    for (const state of states) {
      await this.createFuelPrice(state.name)
    }
  }
  
  async createFuelPrice(stateName: string) {
    const state = stateName.trim().replace(/\s+/g, '-');
    const petrolPrice = await this.getFuelPrices('petrol', state);
    const dieselPrice = await this.getFuelPrices('diesel', state);
    const data = {
      state: stateName,
      petrolPrice: petrolPrice.fuelPrice,
      dieselPrice: dieselPrice.fuelPrice
    }
    return this.fuelPrice.create(data);
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
}
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FuelPrice } from './entities/fuel-price.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { FuelPriceController } from './fuel-price.controller';
import { FuelPriceService } from './fuel-price.service';
import { State } from '../state/entities/state.entity';

@Module({
  imports: [SequelizeModule.forFeature([FuelPrice, State]), HttpModule],
  controllers: [FuelPriceController],
  providers: [FuelPriceService],
})
export class FuelPriceModule {}

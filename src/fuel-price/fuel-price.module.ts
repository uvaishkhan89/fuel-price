import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FuelPrice } from './entities/fuel-price.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { FuelPriceController } from './fuel-price.controller';
import { FuelPriceService } from './fuel-price.service';

@Module({
  imports: [SequelizeModule.forFeature([FuelPrice]), HttpModule],
  controllers: [FuelPriceController],
  providers: [FuelPriceService],
})
export class FuelPriceModule {}

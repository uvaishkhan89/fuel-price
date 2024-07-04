import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { FuelPriceModule } from './fuel-price/fuel-price.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StateModule } from './state/state.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadModels: true,
        synchronize: configService.get<boolean>('DB_SYNC'),
        logging: true,
      }),
      inject: [ConfigService],
    }),
    FuelPriceModule,
    ScheduleModule.forRoot(),
    StateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



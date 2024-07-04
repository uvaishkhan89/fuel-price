import { Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { State } from './entities/state.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StateService {

  constructor(@InjectModel(State) private readonly state: typeof State) {}
  
  @Cron(CronExpression.EVERY_MINUTE)
  async importCountryAndStateFromJSON() {
    const {jsonData}  = require('./state.json.ts');
    try {
      const stateCount = await this.state.count();
      if (stateCount == 0) {
        await this.state.bulkCreate(jsonData)
        return {
          status: true,
          message: 'Initialized',
          data: jsonData.length,
        };
      }
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }
}

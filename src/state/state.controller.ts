import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post('init-master')
  async initMaster() {
    return this.stateService.importCountryAndStateFromJSON();
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IInvestment } from './interfaces/investment.interface';
import { IResponse } from './interfaces/response.interface';
import { IUser } from './interfaces/user.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/investment/:id')
  async getOneInvestment(@Param() id: any): Promise<IResponse> {
    return this.appService.getInvestmentById(id);
  }
  @Get('/investment')
  async getAllInvestmentOfAnUser(@Query() query): Promise<IResponse> {
    return this.appService.getInvestmentsByUserId(query);
  }

  @Post('/investment')
  async createInvestment(@Body() body: IInvestment): Promise<IResponse> {
    const { date, userId, value, description } = body;
    return this.appService.investmentCreator(date, value, userId, description);
  }

  @Put('/investment')
  async cashoutInvestment(@Body() body: any): Promise<IResponse> {
    const { id, cashOutDay } = body;
    return this.appService.cashOut(id, cashOutDay);
  }

  @Post('/user')
  async createUser(@Body() body: IUser): Promise<IResponse> {
    const { name } = body;
    return this.appService.userCreator(name);
  }
}

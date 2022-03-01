import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IResponse } from './interfaces/response.interface';
import { Investments } from './models/investiments';
import { Users } from './models/users.model';
import { gainCalculator } from './workers/gainCalculator';
import { periodValidator } from './workers/periodValidator';
import Responses from './workers/responses';
import { taxesCalculator } from './workers/taxesCalculator';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    @InjectModel(Investments)
    private readonly investmentModel: typeof Investments,
  ) {}
  async getInvestmentsByUserId(query: any): Promise<IResponse> {
    try {
      const { userId, offset } = query;
      let investments: Investments[] | null;
      investments = await this.investmentModel.findAll({
        where: { userId: Number(userId) },
        limit: 2,
        offset: Number(offset),
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletionDate'] },
      });
      if (!!investments[0])
        return Responses._Define(201, {
          results: investments,
        });
      return Responses._Define(401, {
        message: 'couldn´t find Investment, chack data',
      });
    } catch (error) {
      return Responses._Define(500, {
        error,
      });
    }
  }

  async getInvestmentById(id: any): Promise<IResponse> {
    try {
      let investment: Investments | null;
      investment = await this.investmentModel.findOne({
        where: { id: Number(id.id) },
      });

      const gains = gainCalculator(
        investment?.investedAt,
        new Date(),
        investment?.value,
      );
      if (!!investment)
        return Responses._Define(201, {
          investimento: investment.description,
          valor: investment.value,
          saldo: gains,
        });
      return Responses._Define(401, {
        message: 'couldn´t find Investment, chack data',
      });
    } catch (error) {
      return Responses._Define(500, {
        error,
      });
    }
  }

  async cashOut(id: number, cashOutDay: string): Promise<IResponse> {
    try {
      let investment: Investments | null;
      investment = await this.investmentModel.findOne({
        where: { id: Number(id) },
      });
      const result = periodValidator(new Date(cashOutDay));
      if (!result || investment?.investedAt > new Date(cashOutDay))
        return Responses._Define(401, {
          message: 'Period out of limit, check data',
        });
      const gains = gainCalculator(
        investment?.investedAt,
        new Date(cashOutDay),
        investment?.value,
      );

      const taxes = taxesCalculator(
        investment?.investedAt,
        new Date(cashOutDay),
        gains - investment?.value,
      );
      investment.destroy({ force: false });
      return Responses._Define(201, {
        investment: investment.description,
        initialValue: investment.value,
        'value + gains': gains,
        taxes: Number(taxes.toFixed(2)),
        result: `Total amount ${(gains - taxes).toFixed(2)}`,
      });
    } catch (error) {
      return Responses._Define(500, {
        error,
      });
    }
  }

  async investmentCreator(
    date: string,
    value: number,
    userId: number,
    description: string,
  ): Promise<IResponse> {
    try {
      const result = periodValidator(new Date(date));
      if (!result)
        return Responses._Define(401, {
          message: 'Period out of limit',
        });
      let investment: Investments | null;
      investment = await this.investmentModel.create({
        investedAt: new Date(date),
        value,
        userId,
        description,
      });

      if (!!investment)
        return Responses._Define(201, {
          message: `Success. Investment id ${investment.id}`,
        });
      return Responses._Define(401, {
        message: 'error,please check data',
      });
    } catch (error) {
      return Responses._Define(500, {
        error,
      });
    }
  }

  async userCreator(name: string): Promise<IResponse> {
    try {
      let user: Users | null;
      user = await this.userModel.findOne({ where: { name: name } });
      if (!!user)
        return Responses._Define(404, {
          message: 'user already created',
        });
      user = await this.userModel.create({ name: name });
      return Responses._Define(404, {
        message: `user ${name} successfully created. id ${user.id}`,
      });
    } catch (error) {
      return Responses._Define(500, {
        error,
      });
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { Users } from './models/users.model';
import { Investments } from './models/investiments';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersMock } from '../mocks/user-mock';
import { InvestmentsMock } from '../mocks/investment-mock';

const sequelize = new Sequelize({ validateOnly: true });
sequelize.addModels([Users, Investments]);

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    let userMock: UsersMock = new UsersMock();
    let investmentMock: InvestmentsMock = new InvestmentsMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(Users),
          useValue: {
            create: (request) => {
              return userMock.create(request);
            },
            findOne: (request) => {
              return userMock.findOne(request);
            },
          },
        },
        {
          provide: getModelToken(Investments),
          useValue: {
            create: (request) => {
              return investmentMock.create(request);
            },
            findOne: (request) => {
              return investmentMock.findOne(request);
            },
            findAll: (request) => {
              return investmentMock.findAll(request);
            },
          },
        },
      ],
    }).compile();

    appService = module.get(AppService);
  });

  describe('Create user', () => {
    it('Should be able to create an user', async () => {
      const request = {
        name: 'salvation',
      };
      const { name } = request;
      const response = await appService.userCreator(name);
      const successResponse = {
        message: 'user salvation successfully created. id 1',
      };

      expect(response.data).toEqual(successResponse);
    });

    it('Should not be able to create two users with same name', async () => {
      const request = {
        name: 'salvation',
      };
      const { name } = request;

      const failureResponse = {
        message: 'user already created',
      };
      await appService.userCreator(name);

      const repeatedInstert = await appService.userCreator(name);

      expect(repeatedInstert.data).toEqual(failureResponse);
    });

    describe('Find investments', () => {
      it('Should be able of find all investments', async () => {
        await appService.investmentCreator(
          '2020/02/01',
          500,
          1,
          'Investimento Teste 1',
        );
        await appService.investmentCreator(
          '2020/02/01',
          1000,
          1,
          'Investimento Teste 2',
        );
        await appService.investmentCreator(
          '2020/02/01',
          1500,
          1,
          'Investimento Teste 3',
        );

        const findRequest = {
          userId: '1',
          offset: '0',
        };

        const response = await appService.getInvestmentsByUserId(findRequest);

        expect(response.data.results).toHaveLength(3);
      });
    });
  });
  it('Should get one investment by id', async () => {
    await appService.investmentCreator(
      '2020/02/01',
      500,
      1,
      'Investimento Teste 1',
    );
    await appService.investmentCreator(
      '2020/02/01',
      1000,
      1,
      'Investimento Teste 2',
    );
    await appService.investmentCreator(
      '2020/02/01',
      1500,
      1,
      'Investimento Teste 3',
    );

    const firstFindRequest = { id: '2' };
    const secondFindRequest = { id: '1' };

    const firstResponse = await appService.getInvestmentById(firstFindRequest);
    const secondResponse = await appService.getInvestmentById(
      secondFindRequest,
    );

    expect(firstResponse.data.investimento).toBe('Investimento Teste 2');
    expect(secondResponse.data.investimento).toBe('Investimento Teste 1');
  });
  describe('Cashout', () => {
    it('Should return correct value of an investment, profits, taxes', async () => {
      await appService.investmentCreator(
        '2020/02/01',
        500,
        1,
        'Investimento Teste 1',
      );

      const id = 1;
      const cashOutDay = '2022/03/01';
      const cashoutResponse = {
        initialValue: 500,
        investment: 'Investimento Teste 1',
        result: 'Total amount 556.41',
        taxes: 12.81,
        gains: 569.22,
      };

      const response = await appService.cashOut(id, cashOutDay);

      expect(response.data).toStrictEqual(cashoutResponse);
    });
    it('Should not accept cashout with date before investment creation date', async () => {
      await appService.investmentCreator(
        '2020/02/01',
        500,
        1,
        'Investimento Teste 1',
      );

      const id = 1;
      const cashOutDay = '2020/01/01';
      const cashoutResponse = { message: 'Period out of limit, check data' };

      const response = await appService.cashOut(id, cashOutDay);

      expect(response.data).toStrictEqual(cashoutResponse);
    });
  });
  it('Should not accept cashout with date after request date', async () => {
    await appService.investmentCreator(
      '2020/02/01',
      500,
      1,
      'Investimento Teste 1',
    );

    const id = 1;
    const cashOutDay = '3000/02/01';
    const cashoutResponse = { message: 'Period out of limit, check data' };

    const response = await appService.cashOut(id, cashOutDay);

    expect(response.data).toStrictEqual(cashoutResponse);
  });
  it('Should creat an investment', async () => {
    const request = {
      value: 1000,
      date: '2022/03/01',
      userId: 1,
      description: 'Investimento hoje',
    };
    const { value, date, userId, description } = request;
    const response = await appService.investmentCreator(
      date,
      value,
      userId,
      description,
    );
    const successMessage = {message: "Success. Investment id 1"}
   
    expect(response.data).toStrictEqual(successMessage);
  });
  it('Should not creat an investment with later date', async () => {
    const request = {
      value: 1000,
      date: '3000/03/01',
      userId: 1,
      description: 'Investimento Posterior Negado',
    };
    const { value, date, userId, description } = request;
    const response = await appService.investmentCreator(
      date,
      value,
      userId,
      description,
    );
    const failureMessage = {message: "Period out of limit"}
   
    expect(response.data).toStrictEqual(failureMessage);
  });
  it('Should not creat an investment with invalid value', async () => {
    const request = {
      value: -1000,
      date: '2020/03/01',
      userId: 1,
      description: 'Investimento Posterior Negado',
    };
    const { value, date, userId, description } = request;
    const response = await appService.investmentCreator(
      date,
      value,
      userId,
      description,
    );
    const failureMessage = {error: new Error()}
   
    expect(response.data).toStrictEqual(failureMessage)
  });
});

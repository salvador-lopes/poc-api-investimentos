import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentsMock } from '../mocks/investment-mock';
import { UsersMock } from '../mocks/user-mock';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    let userMock: UsersMock = new UsersMock();
    let investmentMock: InvestmentsMock = new InvestmentsMock();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getInvestmentById: jest.fn(),
            getInvestmentsByUserId: jest.fn(),
            investmentCreator: jest.fn(),
            cashOut: jest.fn(),
            userCreator: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get(AppController);
    appService = app.get(AppService);
  });

  describe('Controller calls', () => {
    it('should call getInvestmentById', async () => {
      const id = { id: '1' };
      await appController.getOneInvestment(id);

      expect(appService.getInvestmentById).toBeCalledWith(id);
    });
    it('should call getInvestmentsByUserId', async () => {
      const userId = { userId: '1' };
      await appController.getAllInvestmentOfAnUser(userId);

      expect(appService.getInvestmentsByUserId).toBeCalledWith(userId);
    });
    it('should call createInvestment', async () => {
      const request = {
        value: 1000,
        date: '2022/03/01',
        userId: 1,
        description: 'Investimento hoje',
      };
      const { value, date, userId, description } = request;
      await appController.createInvestment(request);

      expect(appService.investmentCreator).toBeCalledWith(
        date,
        value,
        userId,
        description,
      );
    });
    it('should call cashOut', async () => {
      const request = {
        id: 1,
        cashOutDay: '2022/03/01',
      };
      await appController.cashoutInvestment(request);

      expect(appService.cashOut).toBeCalledWith(request.id, request.cashOutDay);
    });
    it('should call userCreator', async () => {
      const request = {
        name: 'salvation',
      };
      await appController.createUser(request);

      expect(appService.userCreator).toBeCalledWith(request.name);
    });
  });
});

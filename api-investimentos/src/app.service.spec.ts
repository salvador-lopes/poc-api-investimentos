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
    const cashOutDay ='3000/02/01';
    const cashoutResponse = { message: 'Period out of limit, check data' };

    const response = await appService.cashOut(id, cashOutDay);

    expect(response.data).toStrictEqual(cashoutResponse);
  });
});
/*   it('Deve ser capaz de listar um produto por nome', async () => {
      await produtoService.criaProduto({
        propriedade: 'produto',
        token: 'token',
        data: {
          nome: 'Igual 1',
        },
      });
      await produtoService.criaProduto({
        propriedade: 'produto',
        token: 'token',
        data: {
          nome: 'Igual 2',
        },
      });
      await produtoService.criaProduto({
        propriedade: 'produto',
        token: 'token',
        data: {
          nome: 'Diferente 3',
        },
      });

      const findRequest = {
        propriedade: 'produto',
        token: '',
        data: {
          offset: 0,
          filtros: ['nome:Igual'],
          orderField: 'nome',
          orderType: 'DESC',
        },
      };

      const response = await produtoService.buscaProduto(findRequest);

      expect(response.data.registros).toHaveLength(2);
    });

    it('Deve ser capaz de disparar uma exceção caso não encontre o produto por id', async () => {
      const findRequest = {
        propriedade: 'produto',
        token: '',
        data: {
          offset: 0,
          filtros: ['id:2'],
          orderField: 'nome',
          orderType: 'DESC',
        },
      };

      expect(produtoService.buscaProduto(findRequest)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('Deve ser capaz de returna um array vazio caso não encontre um produto pelo nome', async () => {
      await produtoService.criaProduto({
        propriedade: 'produto',
        token: 'token',
        data: {
          nome: 'Produto Teste 1',
        },
      });

      const findRequest = {
        propriedade: 'produto',
        token: '',
        data: {
          offset: 0,
          filtros: ['nome:Txai'],
          orderField: 'nome',
          orderType: 'DESC',
        },
      };
      const response = await produtoService.buscaProduto(findRequest);
      console.log(response);

      expect(response.data.registros).toHaveLength(0);
    });
  });
}); */

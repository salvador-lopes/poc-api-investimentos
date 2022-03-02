import { Investments } from '../src/models/investiments';
export class InvestmentsMock {
  private investments = [];

  async create(data): Promise<Investments> {
    const investment = new Investments();
    if (data.value <= 0) throw new Error();
    Object.assign(investment, {
      id: this.investments.length + 1,
      description: data.description,
      value: data.value,
      investedAt: data.investedAt,
      userId: data.userId,
    });

    this.investments.push(investment);

    return investment;
  }

  async findOne(data): Promise<Investments | undefined> {
    if (data.where.id) {
      const investment = this.investments.find(
        (investment) => investment.id === data.where.id,
      );

      return investment;
    }
  }

  async findAll(data) {
    if (data.where?.userId) {
      const userId = Number(data.where?.userId);
      const investment = this.investments.filter(
        (investment) => investment.userId === userId,
      );

      return investment;
    }

    return this.investments;
  }
}

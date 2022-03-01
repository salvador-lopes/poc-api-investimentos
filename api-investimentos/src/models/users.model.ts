import { AutoIncrement, Column, DeletedAt, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Balances } from "./balances.model";
import { Investments } from "./investiments";




@Table
export class Users extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false })
  name: string;

  @DeletedAt
  deletionDate: Date;

  @HasMany(() => Balances)
  balances: Balances[];
  
  @HasMany(() => Investments)
  investments: Investments[];
 
}

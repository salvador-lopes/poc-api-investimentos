import {
  AutoIncrement,
  Column,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Investments } from './investiments';

@Table
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false, unique: 'name' })
  name: string;

  @DeletedAt
  deletionDate: Date;

  @HasMany(() => Investments)
  investments: Investments[];
}

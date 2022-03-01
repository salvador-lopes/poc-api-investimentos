import { AutoIncrement, BelongsTo, Column, DeletedAt, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Users } from "./users.model";


@Table
export class Investments extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    validate: {
      isNumeric: true,
      isGreatherThan(value: number) {
        if (value <= 0) {
          throw new Error('investimento inválido');
        }
      }
    }
  })
  value: number;

  @DeletedAt
  deletionDate: Date;
 
  @ForeignKey(() => Users)
  @Column({ allowNull: false})
  userId: number;

  @BelongsTo(() => Users, 'userId')
  user: Users;

}
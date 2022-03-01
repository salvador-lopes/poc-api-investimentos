import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Investments } from './models/investiments';
import { Users } from './models/users.model';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forFeature([
      Users,
      Investments    ]),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_LOCAL_HOST,
      port: Number(process.env.DB_LOCAL_PORT),
      username: process.env.DB_LOCAL_USERNAME,
      password: process.env.DB_LOCAL_PASSWORD,
      database: process.env.DB_LOCAL_DBNAME,
      models: [],
      autoLoadModels: true,
      synchronize: true,
      /* sync: { alter: true, force: false } , */
      logging: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      dialectModule: require('mysql2'),
      host: process.env.DB_LOCAL_HOST,
      port: 3306,
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

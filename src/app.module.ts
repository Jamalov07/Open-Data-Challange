import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './app.update';
import { DriverService } from './driver.service';
import { MessageService } from './message.service';
import { Address } from './models/address.model';
import { Driver } from './models/drivers.model';
import { Search } from './models/searches.model';
import { Taxi } from './models/taxi.model';
import { User } from './models/users.model';
import { UserAddress } from './models/user_address.model';
import { UserService } from './user.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '5915186714:AAEWaSZ_ny-mLUrA8DJ__BXRsqnc-ccwn8c',
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    SequelizeModule.forFeature([
      User,
      Address,
      Driver,
      Search,
      Taxi,
      UserAddress,
    ]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Address, Driver, Search, Taxi, UserAddress],
      autoLoadModels: true,
      logging: false,
    }),
  ],

  providers: [AppUpdate, UserService,DriverService,MessageService],
})
export class AppModule {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import User from './user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.PG_HOST,
    //   port: 5432,
    //   username: process.env.PG_USERNAME,
    //   password: process.env.PG_PASSWORD,
    //   database: process.env.PG_DATABASE_NAME,
    //   entities: [User],
    //   synchronize: true,
    // }),
  ],
  controllers: [AuthService],
})
export class AppModule { }

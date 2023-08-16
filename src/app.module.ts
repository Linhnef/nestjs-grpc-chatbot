/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainModule } from './main/main.module';
import ChatbotManager from './main/entity/chat-bot-manager.entity';
import Chatbot from './main/entity/chat-bot.entiry';
import ChatbotAttribute from './main/entity/chat-bot-attribute.entiry';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatbotManager, Chatbot, ChatbotAttribute]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT) || 25060,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE_NAME,
      entities: [ChatbotManager, Chatbot, ChatbotAttribute],
      synchronize: true,
    }),
    MainModule
  ],
})
export class AppModule { }

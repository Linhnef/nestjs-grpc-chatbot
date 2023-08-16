/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStategy } from './service/jwt.stategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MainController } from './controller/main.controller';
import { ChatbotService } from './service/chat-bot.service';
import { ChatbotAttributeService } from './service/chat-bot-attribute.service';
import { ChatbotManagerService } from './service/chat-bot-manager.service';
import ChatbotManager from './entity/chat-bot-manager.entity';
import Chatbot from './entity/chat-bot.entiry';
import ChatbotAttribute from './entity/chat-bot-attribute.entiry';

import { config } from "dotenv"


config()

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'secretKey',
            signOptions: {
                expiresIn: 3600,
            }
        }),
        TypeOrmModule.forFeature([ChatbotManager, Chatbot, ChatbotAttribute]),
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'user',
                    protoPath: join(process.cwd(), 'src/main/protos/rpc/user.proto'),
                    url: process.env.AUTH_GRPC_CONNECTION_URL,
                },
            },
        ])
    ],
    controllers: [MainController],
    providers: [JwtStategy, ChatbotService, ChatbotAttributeService, ChatbotManagerService],
    exports: [PassportModule, JwtStategy]
})
export class MainModule { }
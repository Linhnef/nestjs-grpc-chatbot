/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatbotService } from '../service/chat-bot.service';
import { ChatbotManagerService } from '../service/chat-bot-manager.service';
import { ChatbotAttributeService } from '../service/chat-bot-attribute.service';
import { CreateChatbotDto } from '../dto/create-chat-bot.dto';
import { GetUser } from '../decorator/get-user.decorator';
import { PaginationRequestDto } from 'src/pagination/pagination-request.dto';
import { User } from '../dto/User';

@ApiTags('chat bot')
@Controller()
export class MainController {
    constructor(
        private readonly chatbotService: ChatbotService,
        private readonly chatbotManagerService: ChatbotManagerService,
        private readonly chatbotAttributeService: ChatbotAttributeService,
    ) { }

    @Get('welcome')
    @UseGuards(AuthGuard('jwt'))
    async welcome() {
        return 'welcome !'
    }

    @Post('create-chat-bot')
    @UseGuards(AuthGuard('jwt'))
    async createChatbot(@GetUser() user: User, @Body() params: CreateChatbotDto) {
        return await this.chatbotManagerService.create(user, params)
    }

    @Post('get-all-chat-bot')
    @UseGuards(AuthGuard('jwt'))
    async getAllChatbot(@Body() pagination: PaginationRequestDto, @GetUser() user: User) {
        return await this.chatbotService.getAll(user, pagination)
    }

    @Get('get-chat-bot:id')
    @UseGuards(AuthGuard('jwt'))
    async getChatbot(@GetUser() user: User, @Param('id') id: string) {
        const chatbot = await this.chatbotService.get({ id: id })
        const chatbotAttribute = await this.chatbotAttributeService.get({ id: id })
        return {
            ...chatbot,
            attribute: { ...chatbotAttribute }
        }
    }

}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatbotService } from '../service/chat-bot.service';
import { CreateChatbotDto } from '../dto/create-chat-bot.dto';
import { GetUser } from '../decorator/get-user.decorator';
import { PaginationRequestDto } from 'src/pagination/pagination-request.dto';
import { User } from '../service/grpc-auth.service';
import { UpdateChatbotDto } from '../dto/update-chat-bot-attribute';

@ApiTags('chat bot')
@Controller()
export class MainController {
    constructor(
        private readonly chatbotService: ChatbotService,
    ) { }

    @Get('welcome')
    @UseGuards(AuthGuard('jwt'))
    async welcome() {
        return 'welcome !'
    }

    @Post('create-chat-bot')
    @UseGuards(AuthGuard('jwt'))
    async createChatbot(@GetUser() user: User, @Body() params: CreateChatbotDto) {
        return await this.chatbotService.create(user, params)
    }

    @Post('get-all-chat-bot')
    @UseGuards(AuthGuard('jwt'))
    async getAllChatbot(@Body() pagination: PaginationRequestDto, @GetUser() user: User) {
        return await this.chatbotService.getAll(user, pagination)
    }

    @Get('get-chat-bot/:id')
    @UseGuards(AuthGuard('jwt'))
    async getChatbot(@GetUser() user: User, @Param('id') id: string) {
        return await this.chatbotService.getChatbot(user, id)
    }

    @Post('update-chat-bot')
    @UseGuards(AuthGuard('jwt'))
    async updateChatbot(@GetUser() user: User, @Body() params: UpdateChatbotDto) {
        return await this.chatbotService.updateChatbotAttribute(user, params)
    }


}

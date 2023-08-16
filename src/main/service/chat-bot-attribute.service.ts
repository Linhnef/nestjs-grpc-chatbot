/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import ChatbotAttribute from "../entity/chat-bot-attribute.entiry";
import { CreateChatbotDto } from "../dto/create-chat-bot.dto";
import { GetChatbotDto } from "../dto/get-chat-bot.dto";

@Injectable()
export class ChatbotAttributeService {
    constructor(
        @InjectRepository(ChatbotAttribute)
        private chatbotAttributeRepository: Repository<ChatbotAttribute>,
    ) {

    }

    async create(params: CreateChatbotDto): Promise<ChatbotAttribute> {
        const chatbotAttribute = new ChatbotAttribute()
        chatbotAttribute.color = params.color
        return await this.chatbotAttributeRepository.save(chatbotAttribute)
    }

    async get(params: GetChatbotDto): Promise<ChatbotAttribute> {
        const currentChatbotAttribute = await this.chatbotAttributeRepository.findOne({ where: { id: params.id } })
        if (!currentChatbotAttribute) {
            throw new HttpException('Attribute Not found', HttpStatus.NOT_FOUND)
        }
        return currentChatbotAttribute
    }
}
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import ChatbotManager from "../entity/chat-bot-manager.entity";
import { CreateChatbotDto } from "../dto/create-chat-bot.dto";

import { DeleteChatbotManagerDto } from "../dto/delete-chat-bot-manager.dto";
import { GetChatbotManagerDto } from "../dto/get-chat-bot-manager.dto";
import Chatbot from "../entity/chat-bot.entiry";
import ChatbotAttribute from "../entity/chat-bot-attribute.entiry";
import { User } from "../dto/User";

@Injectable()
export class ChatbotManagerService {
    constructor(
        @InjectRepository(ChatbotManager)
        private chatbotManagerRepository: Repository<ChatbotManager>,
        @InjectRepository(Chatbot)
        private chatbotRepository: Repository<Chatbot>,
        @InjectRepository(ChatbotAttribute)
        private chatbotAttributeRepository: Repository<ChatbotAttribute>,
    ) {

    }

    async create(user: User, params: CreateChatbotDto) {
        // create chatbot
        const currentChatbot = new Chatbot()
        currentChatbot.name = params.name
        currentChatbot.website = params.website
        const chatbot = await this.chatbotRepository.save(currentChatbot)
        // create chatbot manager
        const chatbotManager = new ChatbotManager()
        chatbotManager.creator = user.id
        chatbotManager.chatbot = chatbot
        chatbotManager.owners = [user.id]
        chatbotManager.members = [user.id]
        await this.chatbotManagerRepository.save(chatbotManager)
        // create chatbot attribute
        const currentAttribute = new ChatbotAttribute()
        currentAttribute.color = params.color
        await this.chatbotAttributeRepository.save(currentAttribute)

        return chatbot
    }

    async delete(params: DeleteChatbotManagerDto) {
        const currentChatbotManager = await this.chatbotManagerRepository.findOne({ where: { id: params.id } })
        if (!currentChatbotManager) {
            throw new HttpException('Chat bot manager not found', HttpStatus.NOT_FOUND)
        }
        await this.chatbotManagerRepository.remove(currentChatbotManager)
    }

    async get(params: GetChatbotManagerDto) {
        const currentChatbotManager = await this.chatbotManagerRepository.findOne({ where: { id: params.id } })
        if (!currentChatbotManager) {
            throw new HttpException('Chat bot manager not found', HttpStatus.NOT_FOUND)
        }
        return currentChatbotManager
    }
}
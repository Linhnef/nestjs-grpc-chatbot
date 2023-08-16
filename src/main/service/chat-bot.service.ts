/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Chatbot from "../entity/chat-bot.entiry";
import { Repository } from "typeorm";
import { CreateChatbotDto } from "../dto/create-chat-bot.dto";
import { DeleteChatbotDto } from "../dto/delete-chat-bot.dto";
import { GetChatbotDto } from "../dto/get-chat-bot.dto";
import { PaginationRequestDto } from "src/pagination/pagination-request.dto";
import ChatbotManager from "../entity/chat-bot-manager.entity";
import ChatbotAttribute from "../entity/chat-bot-attribute.entiry";
import { User } from "../dto/User";

@Injectable()
export class ChatbotService {
    constructor(
        @InjectRepository(ChatbotManager)
        private chatbotManagerRepository: Repository<ChatbotManager>,
        @InjectRepository(Chatbot)
        private chatbotRepository: Repository<Chatbot>,
        @InjectRepository(ChatbotAttribute)
        private chatbotAttributeRepository: Repository<ChatbotAttribute>,
    ) {

    }

    async create(params: CreateChatbotDto): Promise<Chatbot> {
        const chatbot = new Chatbot()
        chatbot.name = params.name
        chatbot.website = params.website
        return await this.chatbotRepository.save(chatbot)
    }

    async delete(params: DeleteChatbotDto) {
        const currentChatbot = await this.chatbotRepository.findOne({ where: { id: params.id } })
        if (!currentChatbot) {
            throw new HttpException('Chat bot does not exist', HttpStatus.NOT_FOUND)
        }
        await this.chatbotRepository.remove(currentChatbot)
    }

    async get(params: GetChatbotDto) {
        const currentChatbot = await this.chatbotRepository.findOne({ where: { id: params.id } })
        if (!currentChatbot) {
            throw new HttpException('Chat bot does not exist', HttpStatus.NOT_FOUND)
        }
        return currentChatbot
    }

    async getAllManager(id: string, pagination: PaginationRequestDto) {
        const { sort, orderBy, limit, offset } = pagination;
        const queryBuilder = this.chatbotManagerRepository
            .createQueryBuilder('chatbot_managers')
            .where('chatbot_managers.creator.id = :id', {
                id: id,
            })
            .orderBy(
                `chatbot_managers.${orderBy || 'created_at'}`,
                sort === 'ASC' ? 'ASC' : 'DESC',
            )
            .limit(limit)
            .offset((offset - 1) * limit);
        try {
            const [chatbots, count] = await queryBuilder.getManyAndCount();
            const meta = {
                totalItems: count,
                itemCount: chatbots.length,
                limit: +limit,
                offset: +offset,
            };
            return { items: chatbots, meta };
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async getAll(user: User, pagination: PaginationRequestDto) {
        const { items, meta } = await this.getAllManager(user.id, pagination)

        const rs = []
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            const currentChatbot = await this.chatbotRepository.findOne({ where: { id: element.creator } })
            if (!currentChatbot) continue
            const currentAttribute = await this.chatbotAttributeRepository.findOne({
                where: {
                    id: currentChatbot.id
                }
            })
            if (!currentAttribute) continue
            rs.push({
                ...currentChatbot,
                attribute: { ...currentAttribute }
            })
        }

        return { items: rs, meta }
    }

}
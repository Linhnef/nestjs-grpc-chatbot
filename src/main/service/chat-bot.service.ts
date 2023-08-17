/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Chatbot from "../entity/chat-bot.entiry";
import { Repository } from "typeorm";
import { CreateChatbotDto } from "../dto/create-chat-bot.dto";
import { DeleteChatbotDto } from "../dto/delete-chat-bot.dto";
import { GetChatbotDto } from "../dto/get-chat-bot.dto";
import { PaginationRequestDto } from "src/pagination/pagination-request.dto";
import ChatbotManager from "../entity/chat-bot-manager.entity";
import ChatbotAttribute from "../entity/chat-bot-attribute.entiry";
import { User } from "./grpc-auth.service";
import { UpdateChatbotDto } from "../dto/update-chat-bot-attribute";
import { GrpcUserService } from "./grpc-user-service";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ChatbotService implements OnModuleInit {
    private grpcUserService: GrpcUserService;
    constructor(
        @InjectRepository(ChatbotManager)
        private chatbotManagerRepository: Repository<ChatbotManager>,
        @InjectRepository(Chatbot)
        private chatbotRepository: Repository<Chatbot>,
        @InjectRepository(ChatbotAttribute)
        private chatbotAttributeRepository: Repository<ChatbotAttribute>,
        @Inject('USER_SERVICE')
        private grpcClient: ClientGrpc,
    ) {

    }

    onModuleInit() {
        this.grpcUserService = this.grpcClient.getService<GrpcUserService>('UserService');
    }

    async create(user: User, params: CreateChatbotDto) {
        // create chatbot attribute
        const currentAttribute = new ChatbotAttribute()
        currentAttribute.color = params.color
        const attribute = await this.chatbotAttributeRepository.save(currentAttribute)
        // create chatbot
        const currentChatbot = new Chatbot()
        currentChatbot.name = params.name
        currentChatbot.website = params.website
        currentChatbot.chatbotAttribute = attribute
        const chatbot = await this.chatbotRepository.save(currentChatbot)
        // create chatbot manager
        const chatbotManager = new ChatbotManager()
        chatbotManager.creator = user.id
        chatbotManager.chatbot = chatbot
        chatbotManager.owners = [user.id]
        chatbotManager.members = [user.id]
        const manager = await this.chatbotManagerRepository.save(chatbotManager)
        // update relation ship
        await this.chatbotRepository.update({
            id: chatbot.id,
        }, { chatbotManager: manager })
        await this.chatbotAttributeRepository.update({
            id: attribute.id
        }, { chatbot: chatbot })
        // update onboarding 
        const { exited, isOnboarding, ...props } = await firstValueFrom(this.grpcUserService.getUser({
            email: user.email,
        }))
        if (!isOnboarding) {
            await firstValueFrom(this.grpcUserService.updateUser({
                ...props,
                isOnboarding: true
            }))
        }

        return chatbot
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
            .where('chatbot_managers.creator = :id', {
                id: id,
            })
            .leftJoinAndSelect("chatbot_managers.chatbot", "chatbot")
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
            const current = await this.chatbotRepository.findOne({
                where: { id: element.chatbot.id },
                relations: ['chatbotAttribute', 'chatbotManager']
            })

            const { id, created_at, updated_at, ...props } = current.chatbotAttribute

            if (!current) continue
            rs.push({
                ...element.chatbot,
                attribute: { ...props }
            })
        }

        return { items: rs, meta }
    }

    async updateChatbotAttribute(user: User, params: UpdateChatbotDto) {
        const current = await this.chatbotRepository.findOne({
            where: { id: params.id },
            relations: ['chatbotAttribute', 'chatbotManager']
        })

        if (current.chatbotManager.creator !== user.id) throw new HttpException("Permission Denied", HttpStatus.FORBIDDEN)

        await this.chatbotAttributeRepository.update({ id: current.chatbotAttribute.id }, {
            color: params.color
        })

        await this.chatbotRepository.update({ id: params.id }, {
            name: params.name,
            website: params.website
        })

        return { ...current }
    }

    async getChatbot(user: User, id: string) {
        const current = await this.chatbotRepository.findOne({
            where: { id },
            relations: ['chatbotAttribute', 'chatbotManager']
        })

        if (current.chatbotManager.creator !== user.id) throw new HttpException("Permission Denied", HttpStatus.FORBIDDEN)

        const { chatbotAttribute, ...props } = current
        return {
            ...props,
            attribute: { ...chatbotAttribute }
        }
    }

}
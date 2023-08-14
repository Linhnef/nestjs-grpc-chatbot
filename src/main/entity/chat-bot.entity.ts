/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class ChatBot {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

}

export default ChatBot;
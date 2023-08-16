/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class ChatBot {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: false })
    public website: string;

}

export default ChatBot;
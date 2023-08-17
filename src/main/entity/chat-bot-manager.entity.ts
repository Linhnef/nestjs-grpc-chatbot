/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Chatbot from './chat-bot.entiry';

@Entity('chatbot_managers')
class ChatbotManager {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @OneToOne(() => Chatbot, (chatbot) => chatbot.chatbotManager, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    chatbot: Chatbot

    @Column({ nullable: false })
    creator: string

    @Column("text", { nullable: false, default: [] })
    members: string[]

    @Column("text", { nullable: false, default: [] })
    owners: string[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

}

export default ChatbotManager;
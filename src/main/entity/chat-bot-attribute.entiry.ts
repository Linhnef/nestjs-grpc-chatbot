/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Chatbot from './chat-bot.entiry';
@Entity('chatbot_attributes')
class ChatbotAttribute {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: true, default: "#2a27da" })
    public color: string;

    @OneToOne(() => Chatbot, (chatbot) => chatbot.chatbotManager, { onDelete: "CASCADE" })
    @JoinColumn()
    chatbot: Chatbot

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

}

export default ChatbotAttribute;
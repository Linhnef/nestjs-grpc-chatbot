/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import ChatbotManager from './chat-bot-manager.entity';
import ChatbotAttribute from './chat-bot-attribute.entiry';

@Entity('chatbots')
class Chatbot {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: false })
    public name: string;

    @Column({ nullable: false })
    public website: string;

    @OneToOne(() => ChatbotManager, (chatbotManager) => chatbotManager.chatbot, { onDelete: "CASCADE" })
    @JoinColumn()
    chatbotManager: ChatbotManager

    @OneToOne(() => ChatbotAttribute, (chatbotAttribute) => chatbotAttribute.chatbot, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    chatbotAttribute: ChatbotAttribute

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}

export default Chatbot;
/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class DeleteChatbotDto {
    @ApiProperty()
    id: string
}
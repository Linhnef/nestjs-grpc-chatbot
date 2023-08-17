/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class GetChatbotDto {
    @ApiProperty()
    id: string
}
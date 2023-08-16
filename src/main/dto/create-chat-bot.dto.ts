/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateChatbotDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    website: string

    @ApiProperty()
    color: string
}
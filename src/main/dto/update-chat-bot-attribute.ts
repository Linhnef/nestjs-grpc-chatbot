/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class UpdateChatbotDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    website: string

    @ApiProperty()
    color: string
}
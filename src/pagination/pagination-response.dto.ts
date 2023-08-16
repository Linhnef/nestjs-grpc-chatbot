/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
export class Meta {
    totalItems: number;
    itemCount: number;
    limit: number;
    offset: number;
}

export class PaginationResponseDto {
    @ApiProperty()
    meta: Meta;
}
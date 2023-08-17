/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ERROR_PAGINATION_REQUEST, SortType } from 'src/main/constants/enum';

export class PaginationRequestDto {
    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: ERROR_PAGINATION_REQUEST.OFFSET_IS_NUMBER })
    @Min(0, { message: ERROR_PAGINATION_REQUEST.OFFSET_LESS_THAN_ZERO })
    offset: number;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: ERROR_PAGINATION_REQUEST.LIMIT_IS_NUMBER })
    @Min(1, { message: ERROR_PAGINATION_REQUEST.LIMIT_LESS_THAN_ONE })
    limit: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    orderBy?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SortType, { message: ERROR_PAGINATION_REQUEST.SORT_TYPE })
    sort?: SortType;
}
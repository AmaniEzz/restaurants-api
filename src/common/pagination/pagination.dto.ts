import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

interface PaginationMeta {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

export class PaginationQueryDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit: number;
}

export class PaginatedResponseDto<TData> {
  @ApiProperty()
  items: TData[];

  @ApiProperty()
  meta: PaginationMeta;
}

export { PaginationMeta, PaginatedResponseDto as PaginatedDto };

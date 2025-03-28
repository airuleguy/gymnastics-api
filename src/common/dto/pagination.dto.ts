import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class PageDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PaginationQueryDto {
  @ApiProperty({ 
    description: 'Page number (1-indexed)', 
    required: false, 
    default: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    description: 'Items per page', 
    required: false, 
    default: 15 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 15;

  @ApiProperty({ 
    description: 'Search term', 
    required: false 
  })
  @IsOptional()
  @IsString()
  search?: string;
} 
import { IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  code?: string;
} 
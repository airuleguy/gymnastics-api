import { IsIn, IsNumber, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Club } from '../../clubs/entities/club.entity';
import { Genders } from '../../genders/genders.enum';
import { Type } from 'class-transformer';
import { CreateAthleteDto } from './create-athlete.dto';

export class UpdateAthleteDto extends PartialType(CreateAthleteDto) {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  nid?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(75)
  email?: string;

  @ApiProperty({ type: Date })
  birthDate?: Date;

  @ApiProperty({ type: Date })
  medicalRecordDueDate?: Date;

  @ApiProperty({ enum: [Genders.FEMALE, Genders.MALE] })
  @IsIn([Genders.FEMALE, Genders.MALE])
  gender?: Genders;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  branchId?: number;

  @ApiProperty({ type: Club })
  club?: Club;

  @ApiProperty({ type: String, required: false })
  imageUrl?: string;
}

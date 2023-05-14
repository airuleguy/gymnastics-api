import { IsIn, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Branches } from '../../branches/branches.enum';
import { Club } from '../../clubs/entities/club.entity';
import { Genders } from '../../genders/genders.enum';
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

  @ApiProperty({ enum: [Branches.ARTISTIC, Branches.AEROBIC] })
  @IsIn([Branches.ARTISTIC, Branches.AEROBIC])
  branch?: Branches;

  @ApiProperty({ type: Club })
  club?: Club;
}

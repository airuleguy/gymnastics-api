import { IsIn, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Athlete } from '../../athletes/entities/athlete.entity';
import { FederationTypes } from '../../federation_types/federation_types.enum';

export class CreateClubDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  code: string;

  @ApiProperty({ enum: [FederationTypes.A, FederationTypes.B] })
  @IsIn([FederationTypes.A, FederationTypes.B])
  federationType: FederationTypes;

  @ApiProperty({ type: [Athlete], nullable: true })
  athletes?: Athlete[];
}

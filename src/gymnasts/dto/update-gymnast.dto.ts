import { PartialType } from '@nestjs/swagger';
import { CreateGymnastDto } from './create-gymnast.dto';

export class UpdateGymnastDto extends PartialType(CreateGymnastDto) {}

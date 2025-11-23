import { PartialType } from '@nestjs/swagger';
import { CreateEntrenadorProfileDto } from './create-entrenador-profile.dto';

export class UpdateEntrenadorProfileDto extends PartialType(CreateEntrenadorProfileDto) {}

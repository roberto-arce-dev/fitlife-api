import { PartialType } from '@nestjs/swagger';
import { CreateEntrenadorDto } from './create-entrenador.dto';

export class UpdateEntrenadorDto extends PartialType(CreateEntrenadorDto) {}

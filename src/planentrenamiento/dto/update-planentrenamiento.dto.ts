import { PartialType } from '@nestjs/swagger';
import { CreatePlanEntrenamientoDto } from './create-planentrenamiento.dto';

export class UpdatePlanEntrenamientoDto extends PartialType(CreatePlanEntrenamientoDto) {}

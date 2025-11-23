import { PartialType } from '@nestjs/swagger';
import { CreatePlanNutricionalDto } from './create-plannutricional.dto';

export class UpdatePlanNutricionalDto extends PartialType(CreatePlanNutricionalDto) {}

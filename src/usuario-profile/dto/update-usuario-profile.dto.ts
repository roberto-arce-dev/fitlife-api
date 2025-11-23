import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioProfileDto } from './create-usuario-profile.dto';

export class UpdateUsuarioProfileDto extends PartialType(CreateUsuarioProfileDto) {}

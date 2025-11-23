import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EntrenadorProfileService } from './entrenador-profile.service';
import { CreateEntrenadorProfileDto } from './dto/create-entrenador-profile.dto';
import { UpdateEntrenadorProfileDto } from './dto/update-entrenador-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('entrenador-profile')
@ApiBearerAuth()
@Controller('entrenador-profile')
export class EntrenadorProfileController {
  constructor(private readonly entrenadorprofileService: EntrenadorProfileService) {}

  @Get('me')
  @Roles(Role.ENTRENADOR)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@Request() req) {
    return this.entrenadorprofileService.findByUserId(req.user.id);
  }

  @Put('me')
  @Roles(Role.ENTRENADOR)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@Request() req, @Body() dto: UpdateEntrenadorProfileDto) {
    return this.entrenadorprofileService.update(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.entrenadorprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.entrenadorprofileService.findByUserId(userId);
  }
}

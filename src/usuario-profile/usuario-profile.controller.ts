import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsuarioProfileService } from './usuario-profile.service';
import { CreateUsuarioProfileDto } from './dto/create-usuario-profile.dto';
import { UpdateUsuarioProfileDto } from './dto/update-usuario-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('usuario-profile')
@ApiBearerAuth()
@Controller('usuario-profile')
export class UsuarioProfileController {
  constructor(private readonly usuarioprofileService: UsuarioProfileService) {}

  @Get('me')
  @Roles(Role.USUARIO)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@Request() req) {
    return this.usuarioprofileService.findByUserId(req.user.id);
  }

  @Put('me')
  @Roles(Role.USUARIO)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@Request() req, @Body() dto: UpdateUsuarioProfileDto) {
    return this.usuarioprofileService.update(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.usuarioprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.usuarioprofileService.findByUserId(userId);
  }
}

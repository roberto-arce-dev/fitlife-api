import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PlanEntrenamientoService } from './planentrenamiento.service';
import { CreatePlanEntrenamientoDto } from './dto/create-planentrenamiento.dto';
import { UpdatePlanEntrenamientoDto } from './dto/update-planentrenamiento.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('PlanEntrenamiento')
@ApiBearerAuth('JWT-auth')
@Controller('plan-entrenamiento')
export class PlanEntrenamientoController {
  constructor(
    private readonly planentrenamientoService: PlanEntrenamientoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo PlanEntrenamiento' })
  @ApiBody({ type: CreatePlanEntrenamientoDto })
  @ApiResponse({ status: 201, description: 'PlanEntrenamiento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPlanEntrenamientoDto: CreatePlanEntrenamientoDto) {
    const data = await this.planentrenamientoService.create(createPlanEntrenamientoDto);
    return {
      success: true,
      message: 'PlanEntrenamiento creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Planentrenamiento' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Planentrenamiento' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Planentrenamiento no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.planentrenamientoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { planentrenamiento: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Planentrenaimientos' })
  @ApiResponse({ status: 200, description: 'Lista de Planentrenaimientos' })
  async findAll() {
    const data = await this.planentrenamientoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener planes de entrenamiento por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de planes del usuario' })
  async findByUsuario(@Param('usuarioId') usuarioId: string) {
    const data = await this.planentrenamientoService.findByUsuario(usuarioId);
    return { success: true, data, total: data.length };
  }

  @Get('nivel/:nivel')
  @ApiOperation({ summary: 'Filtrar planes por nivel de dificultad' })
  @ApiParam({ name: 'nivel', description: 'Nivel de dificultad' })
  @ApiResponse({ status: 200, description: 'Lista de planes por nivel' })
  async findByNivel(@Param('nivel') nivel: string) {
    const data = await this.planentrenamientoService.findByNivel(nivel);
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener PlanEntrenamiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del PlanEntrenamiento' })
  @ApiResponse({ status: 200, description: 'PlanEntrenamiento encontrado' })
  @ApiResponse({ status: 404, description: 'PlanEntrenamiento no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.planentrenamientoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar PlanEntrenamiento' })
  @ApiParam({ name: 'id', description: 'ID del PlanEntrenamiento' })
  @ApiBody({ type: UpdatePlanEntrenamientoDto })
  @ApiResponse({ status: 200, description: 'PlanEntrenamiento actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'PlanEntrenamiento no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updatePlanEntrenamientoDto: UpdatePlanEntrenamientoDto
  ) {
    const data = await this.planentrenamientoService.update(id, updatePlanEntrenamientoDto);
    return {
      success: true,
      message: 'PlanEntrenamiento actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar PlanEntrenamiento' })
  @ApiParam({ name: 'id', description: 'ID del PlanEntrenamiento' })
  @ApiResponse({ status: 200, description: 'PlanEntrenamiento eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'PlanEntrenamiento no encontrado' })
  async remove(@Param('id') id: string) {
    const planentrenamiento = await this.planentrenamientoService.findOne(id);
    if (planentrenamiento.imagen) {
      const filename = planentrenamiento.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.planentrenamientoService.remove(id);
    return { success: true, message: 'PlanEntrenamiento eliminado exitosamente' };
  }
}

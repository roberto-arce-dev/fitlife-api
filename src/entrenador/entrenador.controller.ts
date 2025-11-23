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
import { EntrenadorService } from './entrenador.service';
import { CreateEntrenadorDto } from './dto/create-entrenador.dto';
import { UpdateEntrenadorDto } from './dto/update-entrenador.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Entrenador')
@ApiBearerAuth('JWT-auth')
@Controller('entrenador')
export class EntrenadorController {
  constructor(
    private readonly entrenadorService: EntrenadorService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Entrenador' })
  @ApiBody({ type: CreateEntrenadorDto })
  @ApiResponse({ status: 201, description: 'Entrenador creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createEntrenadorDto: CreateEntrenadorDto) {
    const data = await this.entrenadorService.create(createEntrenadorDto);
    return {
      success: true,
      message: 'Entrenador creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Entrenador' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Entrenador' })
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
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
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
    const updated = await this.entrenadorService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { entrenador: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Entrenadors' })
  @ApiResponse({ status: 200, description: 'Lista de Entrenadors' })
  async findAll() {
    const data = await this.entrenadorService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Entrenador por ID' })
  @ApiParam({ name: 'id', description: 'ID del Entrenador' })
  @ApiResponse({ status: 200, description: 'Entrenador encontrado' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.entrenadorService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Entrenador' })
  @ApiParam({ name: 'id', description: 'ID del Entrenador' })
  @ApiBody({ type: UpdateEntrenadorDto })
  @ApiResponse({ status: 200, description: 'Entrenador actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateEntrenadorDto: UpdateEntrenadorDto
  ) {
    const data = await this.entrenadorService.update(id, updateEntrenadorDto);
    return {
      success: true,
      message: 'Entrenador actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Entrenador' })
  @ApiParam({ name: 'id', description: 'ID del Entrenador' })
  @ApiResponse({ status: 200, description: 'Entrenador eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async remove(@Param('id') id: string) {
    const entrenador = await this.entrenadorService.findOne(id);
    if (entrenador.imagen) {
      const filename = entrenador.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.entrenadorService.remove(id);
    return { success: true, message: 'Entrenador eliminado exitosamente' };
  }
}

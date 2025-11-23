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
import { PlanNutricionalService } from './plannutricional.service';
import { CreatePlanNutricionalDto } from './dto/create-plannutricional.dto';
import { UpdatePlanNutricionalDto } from './dto/update-plannutricional.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('PlanNutricional')
@ApiBearerAuth('JWT-auth')
@Controller('plan-nutricional')
export class PlanNutricionalController {
  constructor(
    private readonly plannutricionalService: PlanNutricionalService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo PlanNutricional' })
  @ApiBody({ type: CreatePlanNutricionalDto })
  @ApiResponse({ status: 201, description: 'PlanNutricional creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPlanNutricionalDto: CreatePlanNutricionalDto) {
    const data = await this.plannutricionalService.create(createPlanNutricionalDto);
    return {
      success: true,
      message: 'PlanNutricional creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Plannutricional' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Plannutricional' })
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
  @ApiResponse({ status: 404, description: 'Plannutricional no encontrado' })
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
    const updated = await this.plannutricionalService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { plannutricional: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los PlanNutricionals' })
  @ApiResponse({ status: 200, description: 'Lista de PlanNutricionals' })
  async findAll() {
    const data = await this.plannutricionalService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener PlanNutricional por ID' })
  @ApiParam({ name: 'id', description: 'ID del PlanNutricional' })
  @ApiResponse({ status: 200, description: 'PlanNutricional encontrado' })
  @ApiResponse({ status: 404, description: 'PlanNutricional no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.plannutricionalService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar PlanNutricional' })
  @ApiParam({ name: 'id', description: 'ID del PlanNutricional' })
  @ApiBody({ type: UpdatePlanNutricionalDto })
  @ApiResponse({ status: 200, description: 'PlanNutricional actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'PlanNutricional no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updatePlanNutricionalDto: UpdatePlanNutricionalDto
  ) {
    const data = await this.plannutricionalService.update(id, updatePlanNutricionalDto);
    return {
      success: true,
      message: 'PlanNutricional actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar PlanNutricional' })
  @ApiParam({ name: 'id', description: 'ID del PlanNutricional' })
  @ApiResponse({ status: 200, description: 'PlanNutricional eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'PlanNutricional no encontrado' })
  async remove(@Param('id') id: string) {
    const plannutricional = await this.plannutricionalService.findOne(id);
    if (plannutricional.imagen) {
      const filename = plannutricional.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.plannutricionalService.remove(id);
    return { success: true, message: 'PlanNutricional eliminado exitosamente' };
  }
}

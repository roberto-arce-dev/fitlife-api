import { IsArray, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanEntrenamientoDto {
  @ApiProperty({
    example: 'Nombre del PlanEntrenamiento',
    description: 'Nombre del PlanEntrenamiento',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Descripción del PlanEntrenamiento',
    description: 'Descripción opcional',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({
    example: '653f1f77bcf86cd799439011',
    description: 'ID del entrenador creador del plan',
  })
  @IsMongoId()
  entrenador: string;

  @ApiPropertyOptional({
    example: '653f1f77bcf86cd799439001',
    description: 'ID del usuario al que se asigna el plan',
  })
  @IsOptional()
  @IsMongoId()
  usuario?: string;

  @ApiPropertyOptional({
    example: '653f1f77bcf86cd799439021',
    description: 'Plan nutricional asociado',
  })
  @IsOptional()
  @IsMongoId()
  planNutricional?: string;

  @ApiPropertyOptional({
    example: 8,
    description: 'Duración en semanas del plan',
  })
  @IsOptional()
  @IsNumber()
  duracionSemanas?: number;

  @ApiPropertyOptional({
    example: 'intermedio',
    enum: ['principiante', 'intermedio', 'avanzado'],
  })
  @IsOptional()
  @IsIn(['principiante', 'intermedio', 'avanzado'])
  nivel?: string;

  @ApiPropertyOptional({
    description: 'Lista de ejercicios o bloques del plan',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  ejercicios?: any[];

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}

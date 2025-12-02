import { IsDateString, IsMongoId, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProgresoDto {
  @ApiProperty({
    example: '653f1f77bcf86cd799439011',
    description: 'ID del usuario',
  })
  @IsMongoId()
  usuario: string;

  @ApiPropertyOptional({
    example: '653f1f77bcf86cd799439111',
    description: 'ID del plan de entrenamiento asociado',
  })
  @IsOptional()
  @IsMongoId()
  planEntrenamiento?: string;

  @ApiPropertyOptional({
    example: '653f1f77bcf86cd799439121',
    description: 'ID del plan nutricional asociado',
  })
  @IsOptional()
  @IsMongoId()
  planNutricional?: string;

  @ApiPropertyOptional({
    example: 'peso',
    description: 'Tipo de progreso (peso, reps, tiempo, medida, etc.)',
  })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiPropertyOptional({
    example: 75.3,
    description: 'Valor numérico registrado',
  })
  @IsOptional()
  @IsNumber()
  valor?: number;

  @ApiPropertyOptional({
    example: 'kg',
    description: 'Unidad del valor',
  })
  @IsOptional()
  @IsString()
  unidad?: string;

  @ApiPropertyOptional({
    example: 75.3,
    description: 'Peso del usuario en kg',
  })
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiPropertyOptional({
    example: { pecho: 95, cintura: 80 },
    description: 'Mediciones adicionales',
  })
  @IsOptional()
  @IsObject()
  mediciones?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Fecha del registro en formato ISO',
    example: '2024-08-21T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({
    example: 'Sensación de energía alta',
    description: 'Notas adicionales',
  })
  @IsOptional()
  @IsString()
  notas?: string;

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

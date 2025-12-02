import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegistrarProgresoDto {
  @ApiProperty({
    description: 'ID del usuario que registra el progreso',
    example: '653f1f77bcf86cd799439011',
  })
  @IsMongoId()
  usuarioId: string;

  @ApiProperty({
    description: 'Tipo de progreso (peso, reps, tiempo, medida, etc.)',
    example: 'peso',
  })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({
    description: 'Valor numérico registrado',
    example: 75.2,
  })
  @IsNumber()
  valor: number;

  @ApiPropertyOptional({
    description: 'Unidad asociada al valor',
    example: 'kg',
  })
  @IsOptional()
  @IsString()
  unidad?: string;

  @ApiPropertyOptional({
    description: 'ID del plan de entrenamiento asociado (alias: planEntrenamientoId)',
    example: '653f1f77bcf86cd799439021',
  })
  @IsOptional()
  @IsMongoId()
  planId?: string;

  @ApiPropertyOptional({
    description: 'ID alternativo del plan de entrenamiento',
    example: '653f1f77bcf86cd799439021',
  })
  @IsOptional()
  @IsMongoId()
  planEntrenamientoId?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Semana 2, aumentando carga',
  })
  @IsOptional()
  @IsString()
  notas?: string;
}

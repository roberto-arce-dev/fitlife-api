import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';

/**
 * DTO para registro de usuarios
 * Crea User + Profile correspondiente según el rol
 */
export class RegisterDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: Role.USUARIO,
    description: 'Rol del usuario',
    enum: [Role.USUARIO, Role.ENTRENADOR],
  })
  @IsNotEmpty()
  @IsEnum([Role.USUARIO, Role.ENTRENADOR])
  role: Role;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: '+51 987654321',
    description: 'Teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'edad (opcional)',
  })
  @IsOptional()
  @IsNumber()
  edad?: number;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'peso (opcional)',
  })
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'altura (opcional)',
  })
  @IsOptional()
  @IsNumber()
  altura?: number;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'objetivos (opcional)',
  })
  @IsOptional()
  @IsArray()
  objetivos?: string[];

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'especialidad (para rol ENTRENADOR)',
  })
  @ValidateIf((o) => o.role === Role.ENTRENADOR)
  @IsNotEmpty({ message: 'especialidad es requerido para ENTRENADOR' })
  @IsString()
  especialidad?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'certificaciones (opcional)',
  })
  @IsOptional()
  @IsArray()
  certificaciones?: string[];

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'experiencia (opcional)',
  })
  @IsOptional()
  @IsString()
  experiencia?: string;

}

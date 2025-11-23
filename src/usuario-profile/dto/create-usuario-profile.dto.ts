import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  edad?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  altura?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  objetivos?: string[];

}

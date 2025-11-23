import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ min: 0 })
  peso?: number;

  @Prop({ min: 0 })
  altura?: number;

  @Prop({ min: 0 })
  edad?: number;

  @Prop()
  objetivos?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

UsuarioSchema.index({ email: 1 });

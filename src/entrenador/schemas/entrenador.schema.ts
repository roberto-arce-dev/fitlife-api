import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EntrenadorDocument = Entrenador & Document;

@Schema({ timestamps: true })
export class Entrenador {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  especialidad?: string;

  @Prop({ type: [String], default: [] })
  certificaciones?: any;

  @Prop({ unique: true })
  email: string;

  @Prop()
  telefono?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const EntrenadorSchema = SchemaFactory.createForClass(Entrenador);

EntrenadorSchema.index({ email: 1 });
EntrenadorSchema.index({ especialidad: 1 });

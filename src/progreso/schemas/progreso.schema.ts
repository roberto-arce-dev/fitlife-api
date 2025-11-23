import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProgresoDocument = Progreso & Document;

@Schema({ timestamps: true })
export class Progreso {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  @Prop({ default: Date.now })
  fecha?: Date;

  @Prop({ min: 0 })
  peso?: number;

  @Prop({ type: Object })
  mediciones?: any;

  @Prop()
  foto?: string;

  @Prop()
  notas?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ProgresoSchema = SchemaFactory.createForClass(Progreso);

ProgresoSchema.index({ usuario: 1, fecha: -1 });

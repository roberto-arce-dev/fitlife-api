import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlanNutricionalDocument = PlanNutricional & Document;

@Schema({ timestamps: true })
export class PlanNutricional {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: 'Entrenador', required: true })
  entrenador: Types.ObjectId;

  @Prop({ default: 0 })
  calorias?: number;

  @Prop({ type: Object })
  macros?: any;

  @Prop({ type: Array, default: [] })
  comidas?: any;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PlanNutricionalSchema = SchemaFactory.createForClass(PlanNutricional);

PlanNutricionalSchema.index({ entrenador: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlanEntrenamientoDocument = PlanEntrenamiento & Document;

@Schema({ timestamps: true })
export class PlanEntrenamiento {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: 'Entrenador', required: true })
  entrenador: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuario?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PlanNutricional' })
  planNutricional?: Types.ObjectId;

  @Prop({ default: 4 })
  duracionSemanas?: number;

  @Prop({ type: Array, default: [] })
  ejercicios?: any;

  @Prop({ enum: ['principiante', 'intermedio', 'avanzado'], default: 'principiante' })
  nivel?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PlanEntrenamientoSchema = SchemaFactory.createForClass(PlanEntrenamiento);

PlanEntrenamientoSchema.index({ entrenador: 1 });
PlanEntrenamientoSchema.index({ nivel: 1 });
PlanEntrenamientoSchema.index({ usuario: 1 });
PlanEntrenamientoSchema.index({ planNutricional: 1 });

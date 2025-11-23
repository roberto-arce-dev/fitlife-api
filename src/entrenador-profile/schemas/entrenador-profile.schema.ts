import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type EntrenadorProfileDocument = EntrenadorProfile & Document;

/**
 * EntrenadorProfile - Profile de negocio para rol ENTRENADOR
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class EntrenadorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombreCompleto: string;

  @Prop()
  telefono?: string;

  @Prop()
  especialidad?: string;

  @Prop({ type: [String], default: [] })
  certificaciones?: string[];

  @Prop()
  experiencia?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const EntrenadorProfileSchema = SchemaFactory.createForClass(EntrenadorProfile);

// Indexes para optimizar queries
EntrenadorProfileSchema.index({ user: 1 });

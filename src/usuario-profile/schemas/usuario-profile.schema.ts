import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type UsuarioProfileDocument = UsuarioProfile & Document;

/**
 * UsuarioProfile - Profile de negocio para rol USUARIO
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class UsuarioProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombre: string;

  @Prop()
  telefono?: string;

  @Prop()
  edad?: number;

  @Prop()
  peso?: number;

  @Prop()
  altura?: number;

  @Prop({ type: [String], default: [] })
  objetivos?: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const UsuarioProfileSchema = SchemaFactory.createForClass(UsuarioProfile);

// Indexes para optimizar queries
UsuarioProfileSchema.index({ user: 1 });

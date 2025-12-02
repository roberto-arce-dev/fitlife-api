import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePlanEntrenamientoDto } from './dto/create-planentrenamiento.dto';
import { UpdatePlanEntrenamientoDto } from './dto/update-planentrenamiento.dto';
import { PlanEntrenamiento, PlanEntrenamientoDocument } from './schemas/planentrenamiento.schema';
import { Usuario, UsuarioDocument } from '../usuario/schemas/usuario.schema';
import { PlanNutricional, PlanNutricionalDocument } from '../plannutricional/schemas/plannutricional.schema';

@Injectable()
export class PlanEntrenamientoService {
  constructor(
    @InjectModel(PlanEntrenamiento.name) private planentrenamientoModel: Model<PlanEntrenamientoDocument>,
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    @InjectModel(PlanNutricional.name) private planNutricionalModel: Model<PlanNutricionalDocument>,
  ) {}

  async create(createPlanEntrenamientoDto: CreatePlanEntrenamientoDto): Promise<PlanEntrenamiento> {
    await this.validarReferencias(createPlanEntrenamientoDto);
    const nuevoPlanEntrenamiento = await this.planentrenamientoModel.create(createPlanEntrenamientoDto);
    return this.findOne((nuevoPlanEntrenamiento._id as Types.ObjectId).toString());
  }

  async findAll(): Promise<PlanEntrenamiento[]> {
    const planentrenamientos = await this.planentrenamientoModel
      .find()
      .populate('entrenador', 'nombre especialidad certificaciones')
      .populate('usuario', 'nombre email')
      .populate('planNutricional', 'nombre descripcion calorias');
    return planentrenamientos;
  }

  async findOne(id: string | number): Promise<PlanEntrenamiento> {
    const planentrenamiento = await this.planentrenamientoModel.findById(id)
    .populate('entrenador', 'nombre especialidad certificaciones')
    .populate('usuario', 'nombre email')
    .populate('planNutricional', 'nombre descripcion calorias macros');
    if (!planentrenamiento) {
      throw new NotFoundException(`PlanEntrenamiento con ID ${id} no encontrado`);
    }
    return planentrenamiento;
  }

  async update(id: string | number, updatePlanEntrenamientoDto: UpdatePlanEntrenamientoDto): Promise<PlanEntrenamiento> {
    await this.validarReferencias(updatePlanEntrenamientoDto);
    const planentrenamiento = await this.planentrenamientoModel.findByIdAndUpdate(id, updatePlanEntrenamientoDto, { new: true })
    .populate('entrenador', 'nombre especialidad certificaciones')
    .populate('usuario', 'nombre email')
    .populate('planNutricional', 'nombre descripcion calorias macros');
    if (!planentrenamiento) {
      throw new NotFoundException(`PlanEntrenamiento con ID ${id} no encontrado`);
    }
    return planentrenamiento;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.planentrenamientoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`PlanEntrenamiento con ID ${id} no encontrado`);
    }
  }

  async findByUsuario(usuarioId: string): Promise<PlanEntrenamiento[]> {
    this.validarObjectId(usuarioId, 'Usuario inválido');
    const planes = await this.planentrenamientoModel
      .find({ usuario: new Types.ObjectId(usuarioId) })
      .populate('entrenador', 'nombre especialidad certificaciones')
      .populate('planNutricional', 'nombre descripcion calorias macros')
      .sort({ createdAt: -1 });
    return planes;
  }

  async findByNivel(nivel: string): Promise<PlanEntrenamiento[]> {
    const planes = await this.planentrenamientoModel
      .find({ nivel: { $regex: nivel, $options: 'i' } })
      .populate('entrenador', 'nombre especialidad certificaciones')
      .sort({ createdAt: -1 });
    return planes;
  }

  async asignarUsuario(planId: string, usuarioId: string): Promise<PlanEntrenamiento> {
    this.validarObjectId(planId, 'Plan de entrenamiento inválido');
    this.validarObjectId(usuarioId, 'Usuario inválido');

    const usuario = await this.usuarioModel.exists({ _id: usuarioId });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const plan = await this.planentrenamientoModel
      .findByIdAndUpdate(
        planId,
        { usuario: new Types.ObjectId(usuarioId) },
        { new: true },
      )
      .populate('entrenador', 'nombre especialidad certificaciones')
      .populate('usuario', 'nombre email')
      .populate('planNutricional', 'nombre descripcion calorias macros');

    if (!plan) {
      throw new NotFoundException(`PlanEntrenamiento con ID ${planId} no encontrado`);
    }

    return plan;
  }

  async asignarPlanNutricional(planId: string, planNutricionalId: string): Promise<PlanEntrenamiento> {
    this.validarObjectId(planId, 'Plan de entrenamiento inválido');
    this.validarObjectId(planNutricionalId, 'Plan nutricional inválido');

    const planNutricional = await this.planNutricionalModel.exists({ _id: planNutricionalId });
    if (!planNutricional) {
      throw new NotFoundException(`PlanNutricional con ID ${planNutricionalId} no encontrado`);
    }

    const plan = await this.planentrenamientoModel
      .findByIdAndUpdate(
        planId,
        { planNutricional: new Types.ObjectId(planNutricionalId) },
        { new: true },
      )
      .populate('entrenador', 'nombre especialidad certificaciones')
      .populate('usuario', 'nombre email')
      .populate('planNutricional', 'nombre descripcion calorias macros');

    if (!plan) {
      throw new NotFoundException(`PlanEntrenamiento con ID ${planId} no encontrado`);
    }

    return plan;
  }

  private async validarReferencias(payload: { usuario?: string; planNutricional?: string }) {
    if (payload.usuario) {
      this.validarObjectId(payload.usuario, 'Usuario inválido');
      const usuario = await this.usuarioModel.exists({ _id: payload.usuario });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${payload.usuario} no encontrado`);
      }
    }

    if (payload.planNutricional) {
      this.validarObjectId(payload.planNutricional, 'Plan nutricional inválido');
      const planNutricional = await this.planNutricionalModel.exists({ _id: payload.planNutricional });
      if (!planNutricional) {
        throw new NotFoundException(`PlanNutricional con ID ${payload.planNutricional} no encontrado`);
      }
    }
  }

  private validarObjectId(id: string, mensaje: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(mensaje);
    }
  }
}

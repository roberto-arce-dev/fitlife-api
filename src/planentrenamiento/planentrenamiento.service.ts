import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePlanEntrenamientoDto } from './dto/create-planentrenamiento.dto';
import { UpdatePlanEntrenamientoDto } from './dto/update-planentrenamiento.dto';
import { PlanEntrenamiento, PlanEntrenamientoDocument } from './schemas/planentrenamiento.schema';

@Injectable()
export class PlanEntrenamientoService {
  constructor(
    @InjectModel(PlanEntrenamiento.name) private planentrenamientoModel: Model<PlanEntrenamientoDocument>,
  ) {}

  async create(createPlanEntrenamientoDto: CreatePlanEntrenamientoDto): Promise<PlanEntrenamiento> {
    const nuevoPlanEntrenamiento = await this.planentrenamientoModel.create(createPlanEntrenamientoDto);
    return nuevoPlanEntrenamiento;
  }

  async findAll(): Promise<PlanEntrenamiento[]> {
    const planentrenamientos = await this.planentrenamientoModel.find();
    return planentrenamientos;
  }

  async findOne(id: string | number): Promise<PlanEntrenamiento> {
    const planentrenamiento = await this.planentrenamientoModel.findById(id)
    .populate('entrenador', 'nombre especialidad certificaciones');
    if (!planentrenamiento) {
      throw new NotFoundException(`PlanEntrenamiento con ID ${id} no encontrado`);
    }
    return planentrenamiento;
  }

  async update(id: string | number, updatePlanEntrenamientoDto: UpdatePlanEntrenamientoDto): Promise<PlanEntrenamiento> {
    const planentrenamiento = await this.planentrenamientoModel.findByIdAndUpdate(id, updatePlanEntrenamientoDto, { new: true })
    .populate('entrenador', 'nombre especialidad certificaciones');
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
    const planes = await this.planentrenamientoModel
      .find({ usuario: new Types.ObjectId(usuarioId) })
      .populate('entrenador', 'nombre especialidad certificaciones')
      .sort({ fechaCreacion: -1 });
    return planes;
  }

  async findByNivel(nivel: string): Promise<PlanEntrenamiento[]> {
    const planes = await this.planentrenamientoModel
      .find({ nivel: { $regex: nivel, $options: 'i' } })
      .populate('entrenador', 'nombre especialidad certificaciones')
      .sort({ fechaCreacion: -1 });
    return planes;
  }
}

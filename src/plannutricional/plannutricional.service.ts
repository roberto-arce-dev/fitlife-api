import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlanNutricionalDto } from './dto/create-plannutricional.dto';
import { UpdatePlanNutricionalDto } from './dto/update-plannutricional.dto';
import { PlanNutricional, PlanNutricionalDocument } from './schemas/plannutricional.schema';

@Injectable()
export class PlanNutricionalService {
  constructor(
    @InjectModel(PlanNutricional.name) private plannutricionalModel: Model<PlanNutricionalDocument>,
  ) {}

  async create(createPlanNutricionalDto: CreatePlanNutricionalDto): Promise<PlanNutricional> {
    const nuevoPlanNutricional = await this.plannutricionalModel.create(createPlanNutricionalDto);
    return nuevoPlanNutricional;
  }

  async findAll(): Promise<PlanNutricional[]> {
    const plannutricionals = await this.plannutricionalModel.find();
    return plannutricionals;
  }

  async findOne(id: string | number): Promise<PlanNutricional> {
    const plannutricional = await this.plannutricionalModel.findById(id)
    .populate('entrenador', 'nombre especialidad');
    if (!plannutricional) {
      throw new NotFoundException(`PlanNutricional con ID ${id} no encontrado`);
    }
    return plannutricional;
  }

  async update(id: string | number, updatePlanNutricionalDto: UpdatePlanNutricionalDto): Promise<PlanNutricional> {
    const plannutricional = await this.plannutricionalModel.findByIdAndUpdate(id, updatePlanNutricionalDto, { new: true })
    .populate('entrenador', 'nombre especialidad');
    if (!plannutricional) {
      throw new NotFoundException(`PlanNutricional con ID ${id} no encontrado`);
    }
    return plannutricional;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.plannutricionalModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`PlanNutricional con ID ${id} no encontrado`);
    }
  }
}

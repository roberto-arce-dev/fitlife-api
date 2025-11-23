import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProgresoDto } from './dto/create-progreso.dto';
import { UpdateProgresoDto } from './dto/update-progreso.dto';
import { Progreso, ProgresoDocument } from './schemas/progreso.schema';

@Injectable()
export class ProgresoService {
  constructor(
    @InjectModel(Progreso.name) private progresoModel: Model<ProgresoDocument>,
  ) {}

  async create(createProgresoDto: CreateProgresoDto): Promise<Progreso> {
    const nuevoProgreso = await this.progresoModel.create(createProgresoDto);
    return nuevoProgreso;
  }

  async findAll(): Promise<Progreso[]> {
    const progresos = await this.progresoModel.find();
    return progresos;
  }

  async findOne(id: string | number): Promise<Progreso> {
    const progreso = await this.progresoModel.findById(id)
    .populate('usuario', 'email nombre');
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    return progreso;
  }

  async update(id: string | number, updateProgresoDto: UpdateProgresoDto): Promise<Progreso> {
    const progreso = await this.progresoModel.findByIdAndUpdate(id, updateProgresoDto, { new: true })
    .populate('usuario', 'email nombre');
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    return progreso;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.progresoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
  }
}

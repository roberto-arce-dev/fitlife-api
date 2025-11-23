import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntrenadorDto } from './dto/create-entrenador.dto';
import { UpdateEntrenadorDto } from './dto/update-entrenador.dto';
import { Entrenador, EntrenadorDocument } from './schemas/entrenador.schema';

@Injectable()
export class EntrenadorService {
  constructor(
    @InjectModel(Entrenador.name) private entrenadorModel: Model<EntrenadorDocument>,
  ) {}

  async create(createEntrenadorDto: CreateEntrenadorDto): Promise<Entrenador> {
    const nuevoEntrenador = await this.entrenadorModel.create(createEntrenadorDto);
    return nuevoEntrenador;
  }

  async findAll(): Promise<Entrenador[]> {
    const entrenadors = await this.entrenadorModel.find().populate('usuario', 'nombre email');
    return entrenadors;
  }

  async findOne(id: string | number): Promise<Entrenador> {
    const entrenador = await this.entrenadorModel.findById(id).populate('usuario', 'nombre email');
    if (!entrenador) {
      throw new NotFoundException(`Entrenador con ID ${id} no encontrado`);
    }
    return entrenador;
  }

  async update(id: string | number, updateEntrenadorDto: UpdateEntrenadorDto): Promise<Entrenador> {
    const entrenador = await this.entrenadorModel.findByIdAndUpdate(id, updateEntrenadorDto, { new: true }).populate('usuario', 'nombre email');
    if (!entrenador) {
      throw new NotFoundException(`Entrenador con ID ${id} no encontrado`);
    }
    return entrenador;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.entrenadorModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Entrenador con ID ${id} no encontrado`);
    }
  }
}

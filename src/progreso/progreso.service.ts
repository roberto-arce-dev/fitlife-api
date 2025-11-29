import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findByUsuario(usuarioId: string): Promise<Progreso[]> {
    const progresos = await this.progresoModel
      .find({ usuario: new Types.ObjectId(usuarioId) })
      .populate('usuario', 'email nombre avatar')
      .sort({ fecha: -1 });
    return progresos;
  }

  async getEvolucion(usuarioId: string): Promise<any> {
    const progresos = await this.progresoModel
      .find({ usuario: new Types.ObjectId(usuarioId) })
      .sort({ fecha: 1 });
    
    // Calcular estadísticas de evolución
    const evolucion = {
      totalRegistros: progresos.length,
      primerRegistro: progresos[0]?.fecha || null,
      ultimoRegistro: progresos[progresos.length - 1]?.fecha || null,
      estadisticas: {
        peso: this.calcularEvolucionPeso(progresos),
        medidas: this.calcularEvolucionMedidas(progresos)
      }
    };
    
    return evolucion;
  }

  async registrarProgreso(progresoDto: {
    usuarioId: string;
    tipo: string;
    valor: number;
    unidad?: string;
    planId?: string;
  }): Promise<Progreso> {
    // Adaptamos al schema actual basándose en el tipo
    const datosProgreso: any = {
      usuario: new Types.ObjectId(progresoDto.usuarioId),
      fecha: new Date()
    };

    // Si es peso, lo guardamos en el campo peso
    if (progresoDto.tipo === 'peso') {
      datosProgreso.peso = progresoDto.valor;
    }
    
    // Para otros tipos, los guardamos en mediciones
    if (progresoDto.tipo !== 'peso') {
      datosProgreso.mediciones = {
        tipo: progresoDto.tipo,
        valor: progresoDto.valor,
        unidad: progresoDto.unidad || ''
      };
    }

    const nuevoProgreso = await this.progresoModel.create(datosProgreso);
    return await this.findOne((nuevoProgreso._id as Types.ObjectId).toString());
  }

  private calcularEvolucionPeso(progresos: Progreso[]): any {
    const pesosData = progresos.filter(p => p.peso != null);
    if (pesosData.length === 0) return null;
    
    return {
      inicial: pesosData[0]?.peso || 0,
      actual: pesosData[pesosData.length - 1]?.peso || 0,
      diferencia: (pesosData[pesosData.length - 1]?.peso || 0) - (pesosData[0]?.peso || 0)
    };
  }

  private calcularEvolucionMedidas(progresos: Progreso[]): any {
    const medidasData = progresos.filter(p => p.mediciones != null);
    if (medidasData.length === 0) return null;
    
    return {
      registros: medidasData.length,
      ultimaFecha: medidasData[medidasData.length - 1]?.fecha || null
    };
  }
}

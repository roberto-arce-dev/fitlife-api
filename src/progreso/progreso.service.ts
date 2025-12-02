import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProgresoDto } from './dto/create-progreso.dto';
import { UpdateProgresoDto } from './dto/update-progreso.dto';
import { RegistrarProgresoDto } from './dto/registrar-progreso.dto';
import { Progreso, ProgresoDocument } from './schemas/progreso.schema';
import { Usuario, UsuarioDocument } from '../usuario/schemas/usuario.schema';
import { PlanEntrenamiento, PlanEntrenamientoDocument } from '../planentrenamiento/schemas/planentrenamiento.schema';
import { PlanNutricional, PlanNutricionalDocument } from '../plannutricional/schemas/plannutricional.schema';

@Injectable()
export class ProgresoService {
  constructor(
    @InjectModel(Progreso.name) private progresoModel: Model<ProgresoDocument>,
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    @InjectModel(PlanEntrenamiento.name) private planEntrenamientoModel: Model<PlanEntrenamientoDocument>,
    @InjectModel(PlanNutricional.name) private planNutricionalModel: Model<PlanNutricionalDocument>,
  ) {}

  async create(createProgresoDto: CreateProgresoDto): Promise<Progreso> {
    await this.validarReferencias({
      usuarioId: createProgresoDto.usuario,
      planEntrenamientoId: createProgresoDto.planEntrenamiento,
      planNutricionalId: createProgresoDto.planNutricional,
    });

    let plan: PlanEntrenamientoDocument | null = null;
    if (createProgresoDto.planEntrenamiento) {
      plan = await this.planEntrenamientoModel.findById(createProgresoDto.planEntrenamiento);
    }

    const payload: any = {
      ...createProgresoDto,
      usuario: new Types.ObjectId(createProgresoDto.usuario),
    };

    if (createProgresoDto.planEntrenamiento) {
      payload.planEntrenamiento = new Types.ObjectId(createProgresoDto.planEntrenamiento);
    }

    if (createProgresoDto.planNutricional) {
      payload.planNutricional = new Types.ObjectId(createProgresoDto.planNutricional);
    } else if (plan?.planNutricional) {
      payload.planNutricional = plan.planNutricional;
    }

    const nuevoProgreso = await this.progresoModel.create(payload);
    return this.findOne((nuevoProgreso._id as Types.ObjectId).toString());
  }

  async findAll(): Promise<Progreso[]> {
    const progresos = await this.progresoModel
      .find()
      .populate('usuario', 'email nombre avatar')
      .populate('planEntrenamiento', 'nombre nivel duracionSemanas')
      .populate('planNutricional', 'nombre descripcion calorias');
    return progresos;
  }

  async findOne(id: string | number): Promise<Progreso> {
    const progreso = await this.progresoModel.findById(id)
    .populate('usuario', 'email nombre avatar')
    .populate('planEntrenamiento', 'nombre nivel duracionSemanas planNutricional')
    .populate('planNutricional', 'nombre descripcion calorias macros');
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    return progreso;
  }

  async update(id: string | number, updateProgresoDto: UpdateProgresoDto): Promise<Progreso> {
    await this.validarReferencias({
      usuarioId: updateProgresoDto.usuario,
      planEntrenamientoId: updateProgresoDto.planEntrenamiento,
      planNutricionalId: updateProgresoDto.planNutricional,
    });
    const progreso = await this.progresoModel.findByIdAndUpdate(id, updateProgresoDto, { new: true })
    .populate('usuario', 'email nombre avatar')
    .populate('planEntrenamiento', 'nombre nivel duracionSemanas planNutricional')
    .populate('planNutricional', 'nombre descripcion calorias macros');
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
    this.validarObjectId(usuarioId, 'Usuario inválido');
    const progresos = await this.progresoModel
      .find({ usuario: new Types.ObjectId(usuarioId) })
      .populate('usuario', 'email nombre avatar')
      .populate('planEntrenamiento', 'nombre nivel duracionSemanas planNutricional')
      .populate('planNutricional', 'nombre descripcion calorias')
      .sort({ fecha: -1 });
    return progresos;
  }

  async getEvolucion(usuarioId: string): Promise<any> {
    this.validarObjectId(usuarioId, 'Usuario inválido');
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

  async registrarProgreso(progresoDto: RegistrarProgresoDto): Promise<Progreso> {
    // Adaptamos al schema actual basándose en el tipo
    const planId = progresoDto.planEntrenamientoId || progresoDto.planId;
    await this.validarReferencias({ usuarioId: progresoDto.usuarioId, planEntrenamientoId: planId });

    let plan: PlanEntrenamientoDocument | null = null;
    if (planId) {
      plan = await this.planEntrenamientoModel.findById(planId);
      if (!plan) {
        throw new NotFoundException(`PlanEntrenamiento con ID ${planId} no encontrado`);
      }

      if (plan.usuario && plan.usuario.toString() !== progresoDto.usuarioId) {
        throw new BadRequestException('El plan de entrenamiento no pertenece al usuario especificado');
      }
    }

    const datosProgreso: any = {
      usuario: new Types.ObjectId(progresoDto.usuarioId),
      fecha: new Date(),
      tipo: progresoDto.tipo,
      valor: progresoDto.valor,
      unidad: progresoDto.unidad,
      notas: progresoDto.notas,
      planEntrenamiento: plan?._id,
      planNutricional: plan?.planNutricional,
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

  private async validarReferencias({
    usuarioId,
    planEntrenamientoId,
    planNutricionalId,
  }: {
    usuarioId?: string;
    planEntrenamientoId?: string | null;
    planNutricionalId?: string | null;
  }) {
    if (usuarioId) {
      this.validarObjectId(usuarioId, 'Usuario inválido');
      const usuarioExiste = await this.usuarioModel.exists({ _id: usuarioId });
      if (!usuarioExiste) {
        throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
      }
    }

    if (planEntrenamientoId) {
      this.validarObjectId(planEntrenamientoId, 'Plan de entrenamiento inválido');
      const plan = await this.planEntrenamientoModel.findById(planEntrenamientoId);
      if (!plan) {
        throw new NotFoundException(`PlanEntrenamiento con ID ${planEntrenamientoId} no encontrado`);
      }

      if (usuarioId && plan.usuario && plan.usuario.toString() !== usuarioId) {
        throw new BadRequestException('El plan de entrenamiento no pertenece al usuario especificado');
      }
    }

    if (planNutricionalId) {
      this.validarObjectId(planNutricionalId, 'Plan nutricional inválido');
      const planNutricionalExiste = await this.planNutricionalModel.exists({ _id: planNutricionalId });
      if (!planNutricionalExiste) {
        throw new NotFoundException(`PlanNutricional con ID ${planNutricionalId} no encontrado`);
      }
    }
  }

  private validarObjectId(id: string, mensaje: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(mensaje);
    }
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgresoService } from './progreso.service';
import { ProgresoController } from './progreso.controller';
import { UploadModule } from '../upload/upload.module';
import { Progreso, ProgresoSchema } from './schemas/progreso.schema';
import { Usuario, UsuarioSchema } from '../usuario/schemas/usuario.schema';
import { PlanEntrenamiento, PlanEntrenamientoSchema } from '../planentrenamiento/schemas/planentrenamiento.schema';
import { PlanNutricional, PlanNutricionalSchema } from '../plannutricional/schemas/plannutricional.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progreso.name, schema: ProgresoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: PlanEntrenamiento.name, schema: PlanEntrenamientoSchema },
      { name: PlanNutricional.name, schema: PlanNutricionalSchema },
    ]),
    UploadModule,
  ],
  controllers: [ProgresoController],
  providers: [ProgresoService],
  exports: [ProgresoService],
})
export class ProgresoModule {}

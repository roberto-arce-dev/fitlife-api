import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanEntrenamientoService } from './planentrenamiento.service';
import { PlanEntrenamientoController } from './planentrenamiento.controller';
import { UploadModule } from '../upload/upload.module';
import { PlanEntrenamiento, PlanEntrenamientoSchema } from './schemas/planentrenamiento.schema';
import { Usuario, UsuarioSchema } from '../usuario/schemas/usuario.schema';
import { PlanNutricional, PlanNutricionalSchema } from '../plannutricional/schemas/plannutricional.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlanEntrenamiento.name, schema: PlanEntrenamientoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: PlanNutricional.name, schema: PlanNutricionalSchema },
    ]),
    UploadModule,
  ],
  controllers: [PlanEntrenamientoController],
  providers: [PlanEntrenamientoService],
  exports: [PlanEntrenamientoService],
})
export class PlanEntrenamientoModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanEntrenamientoService } from './planentrenamiento.service';
import { PlanEntrenamientoController } from './planentrenamiento.controller';
import { UploadModule } from '../upload/upload.module';
import { PlanEntrenamiento, PlanEntrenamientoSchema } from './schemas/planentrenamiento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PlanEntrenamiento.name, schema: PlanEntrenamientoSchema }]),
    UploadModule,
  ],
  controllers: [PlanEntrenamientoController],
  providers: [PlanEntrenamientoService],
  exports: [PlanEntrenamientoService],
})
export class PlanEntrenamientoModule {}

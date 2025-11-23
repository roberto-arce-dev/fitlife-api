import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgresoService } from './progreso.service';
import { ProgresoController } from './progreso.controller';
import { UploadModule } from '../upload/upload.module';
import { Progreso, ProgresoSchema } from './schemas/progreso.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progreso.name, schema: ProgresoSchema }]),
    UploadModule,
  ],
  controllers: [ProgresoController],
  providers: [ProgresoService],
  exports: [ProgresoService],
})
export class ProgresoModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrenadorService } from './entrenador.service';
import { EntrenadorController } from './entrenador.controller';
import { UploadModule } from '../upload/upload.module';
import { Entrenador, EntrenadorSchema } from './schemas/entrenador.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entrenador.name, schema: EntrenadorSchema }]),
    UploadModule,
  ],
  controllers: [EntrenadorController],
  providers: [EntrenadorService],
  exports: [EntrenadorService],
})
export class EntrenadorModule {}

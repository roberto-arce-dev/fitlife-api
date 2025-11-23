import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanNutricionalService } from './plannutricional.service';
import { PlanNutricionalController } from './plannutricional.controller';
import { UploadModule } from '../upload/upload.module';
import { PlanNutricional, PlanNutricionalSchema } from './schemas/plannutricional.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PlanNutricional.name, schema: PlanNutricionalSchema }]),
    UploadModule,
  ],
  controllers: [PlanNutricionalController],
  providers: [PlanNutricionalService],
  exports: [PlanNutricionalService],
})
export class PlanNutricionalModule {}

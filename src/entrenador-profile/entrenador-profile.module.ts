import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrenadorProfile, EntrenadorProfileSchema } from './schemas/entrenador-profile.schema';
import { EntrenadorProfileService } from './entrenador-profile.service';
import { EntrenadorProfileController } from './entrenador-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntrenadorProfile.name, schema: EntrenadorProfileSchema },
    ]),
  ],
  controllers: [EntrenadorProfileController],
  providers: [EntrenadorProfileService],
  exports: [EntrenadorProfileService],
})
export class EntrenadorProfileModule {}

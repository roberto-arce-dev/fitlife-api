import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioProfile, UsuarioProfileSchema } from './schemas/usuario-profile.schema';
import { UsuarioProfileService } from './usuario-profile.service';
import { UsuarioProfileController } from './usuario-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsuarioProfile.name, schema: UsuarioProfileSchema },
    ]),
  ],
  controllers: [UsuarioProfileController],
  providers: [UsuarioProfileService],
  exports: [UsuarioProfileService],
})
export class UsuarioProfileModule {}

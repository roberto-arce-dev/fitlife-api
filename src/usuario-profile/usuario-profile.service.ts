import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsuarioProfile, UsuarioProfileDocument } from './schemas/usuario-profile.schema';
import { CreateUsuarioProfileDto } from './dto/create-usuario-profile.dto';
import { UpdateUsuarioProfileDto } from './dto/update-usuario-profile.dto';

@Injectable()
export class UsuarioProfileService {
  constructor(
    @InjectModel(UsuarioProfile.name) private usuarioprofileModel: Model<UsuarioProfileDocument>,
  ) {}

  async create(userId: string, dto: CreateUsuarioProfileDto): Promise<UsuarioProfile> {
    const profile = await this.usuarioprofileModel.create({
      user: new Types.ObjectId(userId),
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<UsuarioProfile | null> {
    return this.usuarioprofileModel.findOne({ user: new Types.ObjectId(userId) }).populate('user', 'email role').exec();
  }

  async findAll(): Promise<UsuarioProfile[]> {
    return this.usuarioprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdateUsuarioProfileDto): Promise<UsuarioProfile> {
    const profile = await this.usuarioprofileModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.usuarioprofileModel.deleteOne({ user: new Types.ObjectId(userId) });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}

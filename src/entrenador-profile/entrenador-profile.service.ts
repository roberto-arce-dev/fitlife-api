import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntrenadorProfile, EntrenadorProfileDocument } from './schemas/entrenador-profile.schema';
import { CreateEntrenadorProfileDto } from './dto/create-entrenador-profile.dto';
import { UpdateEntrenadorProfileDto } from './dto/update-entrenador-profile.dto';

@Injectable()
export class EntrenadorProfileService {
  constructor(
    @InjectModel(EntrenadorProfile.name) private entrenadorprofileModel: Model<EntrenadorProfileDocument>,
  ) {}

  async create(userId: string, dto: CreateEntrenadorProfileDto): Promise<EntrenadorProfile> {
    const profile = await this.entrenadorprofileModel.create({
      user: userId,
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<EntrenadorProfile | null> {
    return this.entrenadorprofileModel.findOne({ user: userId }).populate('user', 'email role').exec();
  }

  async findAll(): Promise<EntrenadorProfile[]> {
    return this.entrenadorprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdateEntrenadorProfileDto): Promise<EntrenadorProfile> {
    const profile = await this.entrenadorprofileModel.findOneAndUpdate(
      { user: userId },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.entrenadorprofileModel.deleteOne({ user: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}

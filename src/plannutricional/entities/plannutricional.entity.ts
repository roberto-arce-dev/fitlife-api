export class PlanNutricional {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PlanNutricional>) {
    Object.assign(this, partial);
  }
}

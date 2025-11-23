export class PlanEntrenamiento {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PlanEntrenamiento>) {
    Object.assign(this, partial);
  }
}

import { IsNumber, Min } from 'class-validator';

export class UpdateCajaDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto de cierre debe ser un número decimal' })
  @Min(0, { message: 'El monto de cierre no puede ser negativo' })
  monto_cierre: number;
}
import { IsNumber, IsPositive, Min, IsOptional } from 'class-validator';

export class CreateCajaDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto de apertura debe ser un número decimal' })
  @Min(0, { message: 'El monto de apertura no puede ser negativo' })
  monto_apertura: number;

  @IsOptional()
  id_usuario?: string; // Opcional si lo extraes directamente del JWT en el controlador
}
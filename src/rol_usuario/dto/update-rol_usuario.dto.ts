import { IsOptional, IsUUID } from 'class-validator';

export class UpdateRolUsuarioDto {
  @IsOptional()
  @IsUUID()
  id_rol?: string;

  @IsOptional()
  @IsUUID()
  id_usuario?: string;
}
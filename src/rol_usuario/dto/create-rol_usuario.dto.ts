import { IsUUID } from 'class-validator';

export class CreateRolUsuarioDto {
  @IsUUID()
  id_rol: string;

  @IsUUID()
  id_usuario: string;
}

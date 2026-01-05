import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRolUsuarioDto {
  @IsUUID()
  @IsNotEmpty()
  id_rol: string;

  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;
}

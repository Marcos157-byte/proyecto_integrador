import { IsOptional, IsString } from "class-validator";

export class UpdateRolDto {
    @IsOptional()
    @IsString()
    rol?: string;
    @IsOptional()
    @IsString()
    descripcion?: string;
}
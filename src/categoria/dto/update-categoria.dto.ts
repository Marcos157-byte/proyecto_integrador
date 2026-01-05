import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCategoriaDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    nombre?: string;
    @IsOptional()
    @IsString()
    descripcion?: string;
}
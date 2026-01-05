import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateRolDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    rol?: string;
    @IsOptional()
    @IsString()
    @MaxLength(100)
    descripcion?: string;
}
import { IsString, IsNumber,IsBoolean, IsOptional } from "class-validator";

export class UpdateProductoDto {

    @IsOptional()
    @IsString()
    id_talla?: string;
    @IsOptional()
    @IsString()
    id_color?: string;
    @IsOptional()
    @IsString()
    id_proveedor?:string;
    @IsOptional()
    @IsString()
    id_categoria?: string;
    @IsOptional()
    @IsString()
    nombre?: string;
    @IsOptional()
    @IsNumber({maxDecimalPlaces:2})
    precio?: number;
    @IsOptional()
    @IsNumber()
    stock_total?: number;
    @IsOptional()
    @IsBoolean()
    activo?: boolean;    
}
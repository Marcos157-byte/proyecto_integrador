import { IsString, IsNumber,IsBoolean, IsOptional } from "class-validator";

export class UpdateProductoDto {

    
    @IsString()
    id_talla: string;
    @IsString()
    id_color: string;
    @IsString()
    id_proveedor:string;
    @IsString()
    id_categoria: string;
    @IsOptional()
    @IsString()
    nombre: string;
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
import { IsString, IsNumber,IsBoolean, IsOptional, IsUUID } from "class-validator";

export class CreateProductoDto {

   
    @IsUUID()
    id_talla: string;
    @IsUUID()
    id_color: string;
    @IsUUID()
    id_proveedor:string;
    @IsUUID()
    id_categoria: string;
    @IsOptional()
    @IsString()
    nombre: string;
    @IsOptional()
    @IsNumber()
    precio: number;
    @IsOptional()
    @IsNumber()
    stock_total: number;
    @IsBoolean()
    activo: boolean;    
}
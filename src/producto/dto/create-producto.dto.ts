import { IsString, IsNumber,IsBoolean, IsOptional, IsUUID, IsNotEmpty } from "class-validator";

export class CreateProductoDto {

   
    @IsString()
    @IsNotEmpty()
    id_talla: string;
    @IsUUID()
    @IsNotEmpty()
    id_color: string;
    @IsUUID()
    @IsNotEmpty()
    id_proveedor:string;
    @IsString()
    @IsNotEmpty()
    id_categoria: string;
    @IsString()
    @IsNotEmpty()
    nombre: string;
    @IsNumber()
    @IsNotEmpty()
    precio: number;
    @IsNumber()
    @IsNotEmpty()
    stock_total: number;
    @IsBoolean()
    @IsNotEmpty()
    activo: boolean;    
}
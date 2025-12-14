import { IsOptional, IsString } from "class-validator";

export class UpdateColorDto{
    
    @IsString()
    color?:string;
}
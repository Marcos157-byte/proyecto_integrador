import { IsString } from "class-validator";

export class UpdateTallaDto {
    @IsString()
    talla: string;
}
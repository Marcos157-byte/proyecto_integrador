import { IsString } from "class-validator";

export class CreateTallaDto {
    @IsString()
    talla: string;
}
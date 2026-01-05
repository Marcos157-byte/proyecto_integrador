import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from 'uuid';

@Schema({collection: 'tallas'})
export class Talla extends Document{
    @Prop({type: String, default: uuidv4})
    id_talla: string;
    @Prop({type: String, required: true, maxlength:10, trim:true, validate: {
    validator: (value: string) => /^[A-Za-z]+$/.test(value), // solo letras
    message: 'El nombre de la talla solo puede contener letras'
  }
})
    nombre: string;
}

export const TallaSchema= SchemaFactory.createForClass(Talla);
TallaSchema.plugin(mongoosePaginate);
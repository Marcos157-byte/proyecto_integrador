import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from 'uuid';

@Schema({collection: 'categorias'})
export class Categoria extends Document {
    @Prop({type: String, default: uuidv4})
    id_categoria: string;
    @Prop({type: String, required: true, maxlength:100, trim:true})
    nombre: string;
    @Prop({type: String, required: true})
    descripcion: string;

}
export const CategoriaSchema= SchemaFactory.createForClass(Categoria);
CategoriaSchema.plugin(mongoosePaginate);
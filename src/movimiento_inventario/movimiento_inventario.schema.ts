import { Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

@Schema({timestamps: true})
export class MovimientoInventario extends Document {
    @Prop({ required: true })
    id_producto: string;

    @Prop({ required: true })
    id_usuario: string;

    @Prop({required: true})
    tipoMovimiento: string;
    @Prop({required: true})
    cantidad: number;
    @Prop({type: Date , default: Date.now})
    fechaMovimiento: Date;
    @Prop({required: true})
    observaciones: string;  // ✅ corregido
    @Prop({required: true})
    motivo: string;

}

export const MovimientoInventarioSchema = SchemaFactory.createForClass(MovimientoInventario);

// 👇 habilitar paginación en el schema
MovimientoInventarioSchema.plugin(mongoosePaginate);


import { Entity, Column, PrimaryGeneratedColumn,ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Talla } from "src/talla/talla.schema";
import { Categoria } from "src/categoria/categoria.schema";
import { Proveedor } from "src/proveedor/proveedor.entity";
import { Color } from "src/color/color.entity";
import { VentaDetalle } from "src/venta_detalle/venta_detalle.entity";


@Entity('productos')
export class Producto {

    @PrimaryGeneratedColumn('uuid')
    id_producto: string;
    @Column({type: 'varchar', length:24})
    id_talla: string;
    @ManyToOne(() => Color, (color) => color.productos, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_color'})
    color:Color;
    @ManyToOne(() => Proveedor, (proveedor) => proveedor.productos, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_proveedor'})
    proveedor:Proveedor;
    @Column({type: 'varchar', length:24})
    categoria_id: string;
    @OneToMany(() => VentaDetalle, (ventaDetalle) => ventaDetalle.producto, {onDelete: 'CASCADE'})
    ventasDetalles: VentaDetalle[]
    @Column()
    nombre: string;
    @Column({type: 'decimal', precision:10, scale: 2})
    precio: number;
    @Column()
    stock_total: number;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;
    @Column()
    activo: boolean;
}

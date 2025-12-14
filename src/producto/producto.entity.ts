import { Entity, Column, PrimaryGeneratedColumn,ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Talla } from "src/talla/talla.entity";
import { Categoria } from "src/categoria/categoria.entity";
import { Proveedor } from "src/proveedor/proveedor.entity";
import { Color } from "src/color/color.entity";
import { VentaDetalle } from "src/venta_detalle/venta_detalle.entity";


@Entity('productos')
export class Producto {

    @PrimaryGeneratedColumn('uuid')
    id_producto: string;
    @ManyToOne(() => Talla, (talla) => talla.productos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_talla' })
    talla: Talla;
    @ManyToOne(() => Color, (color) => color.productos, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_color'})
    color:Color;
    @ManyToOne(() => Proveedor, (proveedor) => proveedor.productos, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_proveedor'})
    proveedor:Proveedor;
    @ManyToOne(() => Categoria, (categoria) => categoria.productos, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_categoria'})
    categoria:Categoria;
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

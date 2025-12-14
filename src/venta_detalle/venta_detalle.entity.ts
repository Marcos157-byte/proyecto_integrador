import { Producto } from "src/producto/producto.entity";
import { Venta } from "src/venta/venta.entity";
import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('ventas_detalles')

export class VentaDetalle{

    @PrimaryGeneratedColumn('uuid')
    id_ventaDetalle: string;
    @ManyToOne(() => Venta, (venta) => venta.ventasDetalles, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_venta'})
    venta:Venta;
    @ManyToOne(() => Producto, (producto) => producto.ventasDetalles, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_producto'})
    producto: Producto;
    @Column()
    cantidad: number;
    @Column('decimal', {precision: 10 , scale: 2 })
    precio_unitario: number;
    @Column('decimal', {precision: 10, scale: 2})
    iva: number;
    @Column('decimal', {precision: 10, scale: 2})
    subtotal: number;

}
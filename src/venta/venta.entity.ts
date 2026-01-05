import { Cliente } from "src/cliente/cliente.entity";
import { Usuario } from "src/usuario/usuario.entity";
import { VentaDetalle } from "src/venta_detalle/venta_detalle.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity('ventas')

export class Venta {
    @PrimaryGeneratedColumn('uuid')
    id_venta:string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    fechaVenta: Date;

    @Column('decimal', {precision: 10, scale: 2})
    total: number;

    @Column({type: 'varchar', length:100})
    metodoPago: string;
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;
    @Column('decimal', { precision: 10, scale: 2 })
    iva: number;

    @ManyToOne(() => Cliente, (cliente) => cliente.ventas, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_cliente'})
    cliente:Cliente;

    @ManyToOne(() => Usuario, (usuario) => usuario.ventas, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_usuario'})
    usuario: Usuario;
    @OneToMany(() => VentaDetalle, (ventaDetalle) => ventaDetalle.venta, {cascade: true, onDelete: 'CASCADE'})
    ventasDetalles: VentaDetalle[]

}
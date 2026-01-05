import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { Producto } from "src/producto/producto.entity";
@Entity('colores')
export class Color {
    @PrimaryGeneratedColumn('uuid')
    id_color: string;

    @Column({type: 'varchar'})
    color: string;

    @OneToMany(() => Producto, (producto) => producto.color, {onDelete: 'CASCADE'})
    productos: Producto[];

}
import { Producto } from "src/producto/producto.entity";
import { Entity,Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('categorias')

export class Categoria {
    @PrimaryGeneratedColumn('uuid')
    id_categoria: string;
    @Column()
    nombre:string;
    @Column()
    descripcion: string;
    @OneToMany(() => Producto, (producto) => producto.categoria, {onDelete: 'CASCADE'})
    productos: Producto[]
}
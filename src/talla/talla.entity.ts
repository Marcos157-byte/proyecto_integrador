import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { Producto } from "src/producto/producto.entity";
@Entity('tallas')
export class Talla {
    @PrimaryGeneratedColumn('uuid')
    id_talla: string;
    @Column()
    talla:string;
    @OneToMany(() => Producto, (producto) => producto.talla)
    productos: Producto[];
}
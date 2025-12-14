import { Producto } from "src/producto/producto.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('proveedores')
export class Proveedor {
    @PrimaryGeneratedColumn('uuid')
    id_proveedor: string;
    @Column()
    nombre: string;
    @Column()
    contacto: string;
    @Column()
    telefono: string;
    @Column()
    email: string;
    @Column()
    direccion: string; 
    @OneToMany(() => Producto, (producto) => producto.proveedor)
    productos:Producto[]
    
}


import { Producto } from "src/producto/producto.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('proveedores')
export class Proveedor {
    @PrimaryGeneratedColumn('uuid')
    id_proveedor: string;
    @Column({type: 'varchar', length:100})
    nombre: string;
    @Column({type: 'varchar', length:100})
    contacto: string;
    @Column({type: 'varchar', length:15})
    telefono: string;
    @Column({type: 'varchar', length:100})
    email: string;
    @Column({type: 'varchar', length: 100})
    direccion: string; 
    @OneToMany(() => Producto, (producto) => producto.proveedor)
    productos:Producto[]
    
}


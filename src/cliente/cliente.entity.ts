import { Venta } from "src/venta/venta.entity";
import { Entity, Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('clientes')
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id_cliente: string;
    @Column()
    nombre: string;
    @Column({unique: true})
    cedula: string;
    @Column()
    telefono: string;
    @Column({unique: true})
    email: string;
    @Column()
    direccion:string; 
    @Column({ default: true })
    isActive: boolean; 

    @OneToMany(() => Venta, (venta) => venta.cliente, {onDelete: 'CASCADE'})
    ventas:Venta[]

}
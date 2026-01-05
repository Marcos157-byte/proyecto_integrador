import { Venta } from "src/venta/venta.entity";
import { Entity, Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('clientes')
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id_cliente: string;
    @Column({type: 'varchar', length:100})
    nombre: string;
    @Column({type: 'varchar',length:10, unique: true})
    cedula: string;
    @Column({type: 'varchar', length:15})
    telefono: string;
    @Column({type:'varchar', length:150, unique: true})
    email: string;
    @Column({type: 'text'})
    direccion:string; 
    @Column({type: 'boolean', default: true })
    isActive: boolean; 

    @OneToMany(() => Venta, (venta) => venta.cliente, {onDelete: 'CASCADE'})
    ventas:Venta[]

}
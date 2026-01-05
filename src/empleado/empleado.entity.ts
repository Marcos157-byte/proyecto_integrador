import { Usuario } from "src/usuario/usuario.entity";
import { Entity,Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('empleados')

export class Empleado{

    @PrimaryGeneratedColumn('uuid')
    id_empleado:string;
    @Column({type: 'varchar', length:100})
    nombre: string
    @Column({type: 'varchar', length:100, nullable: true})
    segundoNombre:string;
    @Column({type: 'varchar', length:100})
    apellido:string;
    @Column({type: 'varchar', length:100})
    segundoApellido:string;
    @Column({type: 'varchar', length:10})
    cedula: string;
    @Column({type: 'varchar', length:200})
    direccion: string;
    @Column({type: 'varchar', length:15})
    telefono:  string;
    @Column({type: 'varchar', length:20})
    genero: string;
    @Column({type: 'int'})
    edad:number;
    @Column({type: 'date'})
    fechaNacimiento: Date;
    @Column({type: 'boolean', default: true})
    estado: boolean;
    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP' })
    fechaCreacion: Date;
    @OneToMany(() => Usuario, (usuario) => usuario.empleado, {onDelete: 'CASCADE'})
    usuarios:Usuario[]
}
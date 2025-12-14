import { Usuario } from "src/usuario/usuario.entity";
import { Entity,Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('empleados')

export class Empleado{

    @PrimaryGeneratedColumn('uuid')
    id_empleado:string;
    @Column()
    nombre: string
    @Column()
    segundoNombre:string;
    @Column()
    apellido:string;
    @Column()
    segundoApellido:string;
    @Column()
    cedula: string;
    @Column()
    direccion: string;
    @Column()
    telefono:  string;
    @Column()
    genero: string;
    @Column()
    edad:number;
    @Column()
    fechaNacimineto: Date;
    @Column()
    estado: boolean;
    @OneToMany(() => Usuario, (usuario) => usuario.empleado, {onDelete: 'CASCADE'})
    usuarios:Usuario[]
}
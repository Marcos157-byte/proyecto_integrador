import { Empleado } from "src/empleado/empleado.entity";
import { RolUsuario } from "src/rol_usuario/rol_usuario.entity";
import { Venta } from "src/venta/venta.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id_usuario: string;
    @Column()
    nombre: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    activo: boolean;
    @ManyToOne(() => Empleado, (empleado) => empleado.usuarios, {onDelete: 'CASCADE'})
    @JoinColumn({name: "id_empleado"})
    empleado: Empleado;
    @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.usuario, {onDelete: 'CASCADE'})
    rolUsuarios: RolUsuario[]
    @OneToMany(() => Venta, (venta) => venta.usuario ,{onDelete: 'CASCADE'})
    ventas: Venta[]

}
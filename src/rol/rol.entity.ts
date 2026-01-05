import { RolUsuario } from "src/rol_usuario/rol_usuario.entity";
import { Entity,Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('roles')

export class Rol {

    @PrimaryGeneratedColumn('uuid')
    id_rol: string
    @Column({type: 'varchar', length:50})
    rol: string;
    @Column({type: 'varchar', length:100})
    descripcion: string;
    @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.rol, {onDelete: 'CASCADE'})
    rolUsuarios: RolUsuario[]
}

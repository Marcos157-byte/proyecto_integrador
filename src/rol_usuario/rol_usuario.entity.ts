
import { Rol } from "src/rol/rol.entity";
import { Usuario } from "src/usuario/usuario.entity";
import { Entity,PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('rol_usuario')
export class RolUsuario{
    @PrimaryGeneratedColumn('uuid')
    id_rolUsuario: string;
    @ManyToOne(() => Rol, (rol) => rol.rolUsuarios, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_rol'})
    rol:Rol;

    @ManyToOne(() => Usuario, (usuario) => usuario.rolUsuarios, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id_usuario'})
    usuario: Usuario;

}
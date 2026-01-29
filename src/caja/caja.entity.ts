import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Venta } from 'src/venta/venta.entity';

@Entity('cajas')
export class Caja {
  @PrimaryGeneratedColumn('uuid')
  id_caja: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monto_apertura: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto_cierre: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_apertura: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_cierre: Date;

  @Column({ type: 'enum', enum: ['abierta', 'cerrada'], default: 'abierta' })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.cajas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => Venta, (venta) => venta.caja)
  ventas: Venta[];
}
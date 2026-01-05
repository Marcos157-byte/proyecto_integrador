import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Cliente } from 'src/cliente/cliente.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { VentaDetalle } from 'src/venta_detalle/venta_detalle.entity';
import { Producto } from 'src/producto/producto.entity';
import { MovimientoInventario } from 'src/movimiento_inventario/movimiento_inventario.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectModel(MovimientoInventario.name)
    private readonly movimientoModel: Model<MovimientoInventario>
    
  ) {}

 async create(createVentaDto: CreateVentaDto) {
  const cliente = await this.clienteRepository.findOne({ where: { id_cliente: createVentaDto.id_cliente } });
  if (!cliente) throw new NotFoundException('Cliente no encontrado');

  const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: createVentaDto.id_usuario } });
  if (!usuario) throw new NotFoundException('Usuario no encontrado');

  const venta = this.ventaRepository.create({
    metodoPago: createVentaDto.metodoPago,
    cliente,
    usuario,
  });

  let subtotalVenta = 0;
  const detalles: VentaDetalle[] = [];

  // 👇 AQUÍ va tu bloque for
  for (const d of createVentaDto.ventasDetalles) {
    const producto = await this.productoRepository.findOne({ where: { id_producto: d.id_producto } });
    if (!producto) throw new NotFoundException(`Producto con id ${d.id_producto} no encontrado`);

    const detalle = new VentaDetalle();
    detalle.producto = producto;
    detalle.cantidad = d.cantidad;
    detalle.precio_unitario = producto.precio;
    detalle.venta = venta;

    subtotalVenta += d.cantidad * producto.precio;
    detalles.push(detalle);

    // 👇 Restar stock en Postgres
    producto.stock_total -= d.cantidad;
    await this.productoRepository.save(producto);

    // 👇 Crear historial en Mongo
    await this.movimientoModel.create({
      id_producto: producto.id_producto,
      id_usuario: createVentaDto.id_usuario,
      tipoMovimiento: 'SALIDA',
      cantidad: d.cantidad,
      observaciones: `Venta ${venta.id_venta}`,
      motivo: 'Venta de producto',
    });
  }

  // luego calculas IVA y guardas la venta
  const IVA_RATE = 0.15;
  venta.subtotal = subtotalVenta;
  venta.iva = subtotalVenta * IVA_RATE;
  venta.total = subtotalVenta + venta.iva;
  venta.ventasDetalles = detalles;

  const saved = await this.ventaRepository.save(venta);

  // construir respuesta plana
  const response = {
    id_venta: saved.id_venta,
    fechaVenta: saved.fechaVenta,
    metodoPago: saved.metodoPago,
    subtotal: saved.subtotal,
    iva: saved.iva,
    total: saved.total,
    cliente: saved.cliente,
    usuario: {
      id_usuario: saved.usuario.id_usuario,
      nombre: saved.usuario.nombre,
      email: saved.usuario.email,
      activo: saved.usuario.activo,
    },
    ventasDetalles: saved.ventasDetalles?.map(det => ({
      id_ventaDetalle: det.id_ventaDetalle,
      cantidad: det.cantidad,
      precio_unitario: det.precio_unitario,
      producto: det.producto,
    })),
  };

  return new SuccessResponseDto('Venta registrada correctamente', response);
}

  async findAll(query: QueryDto) {
    const { page, limit, search, searchField, sort, order } = query;

    const qb = this.ventaRepository.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.ventasDetalles', 'ventasDetalles')
      .leftJoinAndSelect('ventasDetalles.producto', 'producto')
      .skip((page - 1) * limit)
      .take(limit);

    const allowedFields = ['metodoPago', 'total', 'fechaVenta'];

    if (search && searchField && allowedFields.includes(searchField)) {
      qb.andWhere(`venta.${searchField} LIKE :search`, { search: `%${search}%` });
    }

    if (sort && allowedFields.includes(sort)) {
      qb.orderBy(`venta.${sort}`, order ?? 'ASC');
    }

    const [data, total] = await qb.getManyAndCount();

    // 👇 mapear cada venta a objeto plano
    const mappedData = data.map(saved => ({
      id_venta: saved.id_venta,
      fechaVenta: saved.fechaVenta,
      metodoPago: saved.metodoPago,
      subtotal: saved.subtotal,
      iva: saved.iva,
      total: saved.total,
      cliente: saved.cliente,
      usuario: saved.usuario,
      ventasDetalles: saved.ventasDetalles?.map(det => ({
        id_ventaDetalle: det.id_ventaDetalle,
        cantidad: det.cantidad,
        precio_unitario: det.precio_unitario,
        producto: det.producto,
      })),
    }));

    return new SuccessResponseDto('Ventas obtenidas correctamente', {
      data: mappedData,
      total,
      page,
      limit,
    });
  }

  async findOne(id_venta: string) {
    const venta = await this.ventaRepository.findOne({
      where: { id_venta },
      relations: ['cliente', 'usuario', 'ventasDetalles', 'ventasDetalles.producto'],
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');

    const response = {
      id_venta: venta.id_venta,
      fechaVenta: venta.fechaVenta,
      metodoPago: venta.metodoPago,
      subtotal: venta.subtotal,
      iva: venta.iva,
      total: venta.total,
      cliente: venta.cliente,
      usuario: venta.usuario,
      ventasDetalles: venta.ventasDetalles?.map(det => ({
        id_ventaDetalle: det.id_ventaDetalle,
        cantidad: det.cantidad,
        precio_unitario: det.precio_unitario,
        producto: det.producto,
      })),
    };

    return new SuccessResponseDto('Venta obtenida correctamente', response);
  }

  async update(id_venta: string, updateVentaDto: UpdateVentaDto) {
    const venta = await this.ventaRepository.findOne({
      where: { id_venta },
      relations: ['ventasDetalles'],
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');

    if (updateVentaDto.metodoPago) {
      venta.metodoPago = updateVentaDto.metodoPago;
    }

    if (updateVentaDto.id_cliente) {
      venta.cliente = { id_cliente: updateVentaDto.id_cliente } as any;
    }

    if (updateVentaDto.id_usuario) {
      venta.usuario = { id_usuario: updateVentaDto.id_usuario } as any;
    }

    if (updateVentaDto.ventasDetalles) {
      let subtotalVenta = 0;
      const nuevosDetalles: VentaDetalle[] = [];

      for (const d of updateVentaDto.ventasDetalles) {
        const producto = await this.productoRepository.findOne({ where: { id_producto: d.id_producto } });
        if (!producto) throw new NotFoundException(`Producto con id ${d.id_producto} no encontrado`);

        const detalle = new VentaDetalle();
        detalle.producto = producto;
        detalle.cantidad = d.cantidad;
        detalle.precio_unitario = producto.precio;
        detalle.venta = venta;

        subtotalVenta += d.cantidad * producto.precio;
        nuevosDetalles.push(detalle);
      }

      const IVA_RATE = 0.15;
      venta.subtotal = subtotalVenta;
      venta.iva = subtotalVenta * IVA_RATE;
      venta.total = venta.subtotal + venta.iva;
      venta.ventasDetalles = nuevosDetalles;
    }

    const saved = await this.ventaRepository.save(venta);

    const response = {
      id_venta: saved.id_venta,
      fechaVenta: saved.fechaVenta,
      metodoPago: saved.metodoPago,
      subtotal: saved.subtotal,
      iva: saved.iva,
      total: saved.total,
      cliente: saved.cliente,
      usuario: saved.usuario,
      ventasDetalles: saved.ventasDetalles?.map(det => ({
        id_ventaDetalle: det.id_ventaDetalle,
        cantidad: det.cantidad,
        precio_unitario: det.precio_unitario,
        producto: det.producto,
      })),
    };

    return new SuccessResponseDto('Venta actualizada correctamente', response);
  }

  async remove(id_venta: string) {
    const venta = await this.ventaRepository.findOne({ where: { id_venta } });
    if (!venta) throw new NotFoundException('Venta no encontrada');

    await this.ventaRepository.remove(venta);
    return new SuccessResponseDto('Venta eliminada correctamente', null);
  }
}
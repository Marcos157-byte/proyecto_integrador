import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, DataSource } from 'typeorm';
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
import { CajaService } from 'src/caja/caja.service'; // <--- Importamos CajaService

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
    private readonly movimientoModel: Model<MovimientoInventario>,
    private readonly cajaService: CajaService, // <--- Inyectamos el servicio de caja
    private readonly dataSource: DataSource
  ) {}

  // 1. CREAR VENTA (Con validación de Caja Abierta)
  async create(createVentaDto: CreateVentaDto) {
  // A. Validar que el usuario tenga una caja abierta y obtener su ID real
  const resumenCaja = await this.cajaService.getCajaActiva(createVentaDto.id_usuario);
  
  if (!resumenCaja || !resumenCaja.id_caja) {
    throw new BadRequestException('No puedes realizar ventas sin haber abierto caja.');
  }

  return await this.dataSource.transaction(async (manager) => {
    // B. Validar Cliente y Usuario mediante el Transaction Manager
    const cliente = await manager.findOne(Cliente, { 
      where: { id_cliente: createVentaDto.id_cliente } 
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    const usuario = await manager.findOne(Usuario, { 
      where: { id_usuario: createVentaDto.id_usuario } 
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // C. Crear la instancia de la Venta
    // Se asignan objetos parciales con el ID para asegurar la relación en TypeORM
    const nuevaVenta = manager.create(Venta, {
      metodoPago: createVentaDto.metodoPago,
      cliente: { id_cliente: cliente.id_cliente },
      usuario: { id_usuario: usuario.id_usuario },
      caja: { id_caja: resumenCaja.id_caja }, 
      subtotal: 0,
      iva: 0,
      total: 0,
      fechaVenta: new Date()
    });

    // Guardamos la venta inicialmente para generar el ID necesario para los detalles
    const ventaGuardada = await manager.save(nuevaVenta);

    let acumuladorSubtotal = 0;
    const detallesParaGuardar: VentaDetalle[] = [];

    // D. Procesar Productos e Inventario
    for (const d of createVentaDto.ventasDetalles) {
      const producto = await manager.findOne(Producto, { 
        where: { id_producto: d.id_producto } 
      });
      
      if (!producto) {
        throw new NotFoundException(`Producto ID ${d.id_producto} no encontrado`);
      }

      // Validación de Stock estricta
      const stockActual = Number(producto.stock_total);
      if (stockActual < d.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Disponible: ${stockActual}`);
      }

      // Actualizar Stock del producto
      producto.stock_total = stockActual - d.cantidad;
      await manager.save(producto);

      // Crear el detalle de la venta
      const precioUnitario = Number(producto.precio);
      const detalle = manager.create(VentaDetalle, {
        producto: { id_producto: producto.id_producto },
        cantidad: d.cantidad,
        precio_unitario: precioUnitario,
        venta: { id_venta: ventaGuardada.id_venta }
      });

      detallesParaGuardar.push(detalle);
      acumuladorSubtotal += d.cantidad * precioUnitario;

      // Historial en MongoDB (Operación fuera de la transacción SQL principal)
      try {
        await new this.movimientoModel({
          id_producto: producto.id_producto,
          id_usuario: usuario.id_usuario,
          tipoMovimiento: 'SALIDA',
          cantidad: d.cantidad,
          observaciones: `Venta: ${ventaGuardada.id_venta}`,
          motivo: 'VENTA',
          fechaMovimiento: new Date(),
        }).save();
      } catch (e) {
        console.error("Error al registrar movimiento en Mongo:", e.message);
      }
    }

    // E. Guardar todos los detalles de una sola vez
    await manager.save(VentaDetalle, detallesParaGuardar);

    // F. Calcular Totales Finales (IVA 15%)
    // Actualizamos la entidad ya guardada con los valores finales
    ventaGuardada.subtotal = Number(acumuladorSubtotal.toFixed(2));
    ventaGuardada.iva = Number((acumuladorSubtotal * 0.15).toFixed(2));
    ventaGuardada.total = Number((ventaGuardada.subtotal + ventaGuardada.iva).toFixed(2));

    // El segundo 'save' actualiza los montos sin error de campos faltantes
    await manager.save(ventaGuardada);

    return new SuccessResponseDto('Venta registrada con éxito', {
      id_venta: ventaGuardada.id_venta,
      total: ventaGuardada.total,
      caja_afectada: resumenCaja.id_caja
    });
  });
}
  async update(id_venta: string, updateVentaDto: UpdateVentaDto) {
    // 1. Verificar que la venta existe
    const ventaExistente = await this.ventaRepository.findOne({
      where: { id_venta },
      relations: ['ventasDetalles', 'ventasDetalles.producto', 'usuario'],
    });

    if (!ventaExistente) throw new NotFoundException('Venta no encontrada');

    return await this.dataSource.transaction(async (manager) => {
      // 2. Actualizar datos básicos si vienen en el DTO
      if (updateVentaDto.metodoPago) ventaExistente.metodoPago = updateVentaDto.metodoPago;
      
      if (updateVentaDto.id_cliente) {
        ventaExistente.cliente = { id_cliente: updateVentaDto.id_cliente } as any;
      }

      // 3. Si hay cambios en los detalles (productos), hay que revertir stock y recalcular
      if (updateVentaDto.ventasDetalles && updateVentaDto.ventasDetalles.length > 0) {
        
        // A. REVERTIR STOCK: Devolver al inventario lo que se vendió originalmente
        for (const detalleViejo of ventaExistente.ventasDetalles) {
          const producto = await manager.findOne(Producto, { 
            where: { id_producto: detalleViejo.producto.id_producto } 
          });
          if (producto) {
            producto.stock_total = Number(producto.stock_total) + detalleViejo.cantidad;
            await manager.save(producto);
          }
        }

        // B. ELIMINAR DETALLES VIEJOS
        await manager.delete(VentaDetalle, { venta: { id_venta } });

        // C. PROCESAR NUEVOS PRODUCTOS
        let nuevoSubtotal = 0;
        const nuevosDetalles: VentaDetalle[] = [];

        for (const d of updateVentaDto.ventasDetalles) {
          const producto = await manager.findOne(Producto, { where: { id_producto: d.id_producto } });
          if (!producto) throw new NotFoundException(`Producto ${d.id_producto} no encontrado`);

          // Validar nuevo stock
          if (Number(producto.stock_total) < d.cantidad) {
            throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);
          }

          // Descontar nuevo stock
          producto.stock_total = Number(producto.stock_total) - d.cantidad;
          await manager.save(producto);

          const nuevoDetalle = manager.create(VentaDetalle, {
            producto,
            cantidad: d.cantidad,
            precio_unitario: Number(producto.precio),
            venta: ventaExistente
          });

          nuevosDetalles.push(nuevoDetalle);
          nuevoSubtotal += d.cantidad * Number(producto.precio);
        }

        // D. ACTUALIZAR TOTALES
        ventaExistente.subtotal = Number(nuevoSubtotal.toFixed(2));
        ventaExistente.iva = Number((nuevoSubtotal * 0.15).toFixed(2));
        ventaExistente.total = Number((ventaExistente.subtotal + ventaExistente.iva).toFixed(2));
        
        await manager.save(VentaDetalle, nuevosDetalles);
      }

      // 4. GUARDAR CAMBIOS FINALES EN LA VENTA
      const ventaActualizada = await manager.save(ventaExistente);

      return new SuccessResponseDto('Venta actualizada correctamente', {
        id_venta: ventaActualizada.id_venta,
        total: ventaActualizada.total
      });
    });
  }

  // 2. HISTORIAL PARA EL FRONTEND (Mis Ventas)
  async findMisVentas(id_usuario: string, query: QueryDto) {
    const { page, limit } = query;

    const [data, total] = await this.ventaRepository.findAndCount({
      where: { usuario: { id_usuario } },
      relations: ['cliente', 'ventasDetalles', 'ventasDetalles.producto'],
      order: { fechaVenta: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const mappedData = data.map(v => ({
      id_venta: v.id_venta,
      fechaVenta: v.fechaVenta,
      total: Number(v.total),
      metodoPago: v.metodoPago,
      cliente: {
        id_cliente: v.cliente?.id_cliente,
        nombre_completo: v.cliente?.nombre || 'Consumidor Final',
        cedula: v.cliente?.cedula
      },
      ventasDetalles: v.ventasDetalles?.map(det => ({
        id_ventaDetalle: det.id_ventaDetalle,
        cantidad: det.cantidad,
        precio_unitario: Number(det.precio_unitario),
        producto: { nombre: det.producto?.nombre }
      })),
    }));

    return new SuccessResponseDto('Historial cargado', { data: mappedData, total, page, limit });
  }

  // 3. RESUMEN RÁPIDO PARA DASHBOARD VENDEDOR
  async getResumenVendedor(id_usuario: string) {
    const cajaActiva = await this.cajaService.getCajaActiva(id_usuario);
    
    if (!cajaActiva) {
      return { totalCaja: 0, conteoVentas: 0, estado: 'Cerrada' };
    }

    return {
      totalCaja: Number(cajaActiva.monto_esperado.toFixed(2)),
      conteoVentas: cajaActiva.total_transacciones,
      id_caja: cajaActiva.id_caja,
      estado: 'Abierta'
    };
  }

  // 4. FIND ALL (Admin)
  async findAll(query: QueryDto) {
    const { page, limit } = query;
    const [data, total] = await this.ventaRepository.findAndCount({
      relations: ['cliente', 'usuario'],
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaVenta: 'DESC' }
    });

    return new SuccessResponseDto('Ventas obtenidas', { data, total, page, limit });
  }

  // 5. FIND ONE
  async findOne(id_venta: string) {
    const venta = await this.ventaRepository.findOne({
      where: { id_venta },
      relations: ['cliente', 'usuario', 'ventasDetalles', 'ventasDetalles.producto'],
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return new SuccessResponseDto('Venta obtenida', venta);
  }

  // 6. ELIMINAR (Solo Admin)
  async remove(id_venta: string) {
    const venta = await this.ventaRepository.findOne({ where: { id_venta } });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    await this.ventaRepository.remove(venta);
    return new SuccessResponseDto('Venta eliminada', null);
  }

  // 7. ANALÍTICA: PRODUCTOS MÁS VENDIDOS
  async productosMasVendidos(periodo: string) {
    const qb = this.ventaRepository.createQueryBuilder("venta")
      .leftJoin("venta.ventasDetalles", "detalle")
      .leftJoin("detalle.producto", "producto")
      .select("producto.nombre", "producto")
      .addSelect("SUM(detalle.cantidad)", "cantidadVendida")
      .groupBy("producto.id_producto, producto.nombre")
      .orderBy('"cantidadVendida"', "DESC");

    if (periodo === "dia") qb.andWhere("venta.fechaVenta >= CURRENT_DATE");
    if (periodo === "mes") qb.andWhere("venta.fechaVenta >= DATE_TRUNC('month', CURRENT_DATE)");

    const data = await qb.limit(5).getRawMany();
    return new SuccessResponseDto("Top productos", data);
  }
  // 8. REPORTE: VENTAS POR USUARIO (Ranking para el Admin)
  async rankingVendedores(fechaInicio?: Date, fechaFin?: Date) {
    const qb = this.ventaRepository.createQueryBuilder("venta")
      .leftJoin("venta.usuario", "usuario")
      .select("usuario.id_usuario", "id_usuario")
      .addSelect("usuario.nombre", "nombre_vendedor")
      .addSelect("COUNT(venta.id_venta)", "total_ventas")
      .addSelect("SUM(venta.total)", "monto_total_acumulado")
      .groupBy("usuario.id_usuario, usuario.nombre")
      .orderBy('"monto_total_acumulado"', "DESC");

    // Si quieres filtrar por fechas (ej. las ventas de este mes)
    if (fechaInicio && fechaFin) {
      qb.andWhere("venta.fechaVenta BETWEEN :inicio AND :fin", { 
        inicio: fechaInicio, 
        fin: fechaFin 
      });
    }

    const data = await qb.getRawMany();
    return new SuccessResponseDto("Ranking de vendedores obtenido", data);
  }

  // 9. DETALLE: TODAS LAS VENTAS DE UN USUARIO ESPECÍFICO
  async findVentasByUsuario(id_usuario: string) {
    const ventas = await this.ventaRepository.find({
      where: { usuario: { id_usuario } },
      relations: ['cliente', 'ventasDetalles', 'ventasDetalles.producto'],
      order: { fechaVenta: 'DESC' }
    });

    if (!ventas.length) {
      throw new NotFoundException('Este usuario no tiene ventas registradas.');
    }

    // Mapeamos para que el frontend reciba algo limpio
    const data = ventas.map(v => ({
      factura: v.id_venta.substring(0, 8), // Un ID corto para la tabla
      fecha: v.fechaVenta,
      cliente: v.cliente?.nombre || 'Consumidor Final',
      cedula: v.cliente?.cedula || 'N/A',
      total: Number(v.total),
      metodo: v.metodoPago,
      items: v.ventasDetalles.map(d => ({
        producto: d.producto.nombre,
        cantidad: d.cantidad,
        subtotal: Number(d.precio_unitario) * d.cantidad
      }))
    }));

    return new SuccessResponseDto(`Ventas del usuario obtenidas`, data);
  }
  
  
  async reportePorRango(desde: string, hasta: string) {
  const inicio = new Date(desde);
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(hasta);
  fin.setHours(23, 59, 59, 999);

  const ventas = await this.ventaRepository.find({
    where: {
      fechaVenta: Between(inicio, fin),
    },
    // Cargamos todas las relaciones necesarias
    relations: ['usuario', 'cliente', 'ventasDetalles', 'ventasDetalles.producto'],
    order: { fechaVenta: 'DESC' }
  });

  
  return ventas.map(v => ({
    id: v.id_venta,
    fecha: v.fechaVenta,
    vendedor: v.usuario?.nombre || 'SISTEMA',
    cliente: v.cliente?.nombre || 'Consumidor Final',
    identificacion: v.cliente?.cedula || '9999999999',
    // Concatenamos los nombres de los productos vendidos
    productos: v.ventasDetalles.map(d => `${d.producto.nombre} (x${d.cantidad})`).join(', '),
    metodo: v.metodoPago,
    subtotal: Number(v.subtotal),
    iva: Number(v.iva),
    total: Number(v.total)
  }));
}
}
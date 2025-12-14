import { Test, TestingModule } from '@nestjs/testing';
import { VentaDetalleService } from './venta_detalle.service';

describe('VentaDetalleService', () => {
  let service: VentaDetalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VentaDetalleService],
    }).compile();

    service = module.get<VentaDetalleService>(VentaDetalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TallaService } from './talla.service';

describe('TallaService', () => {
  let service: TallaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TallaService],
    }).compile();

    service = module.get<TallaService>(TallaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

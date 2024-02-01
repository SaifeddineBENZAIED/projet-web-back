import { Test, TestingModule } from '@nestjs/testing';
import { StrategyImageContextService } from './strategy-image-context.service';

describe('StrategyImageContextService', () => {
  let service: StrategyImageContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StrategyImageContextService],
    }).compile();

    service = module.get<StrategyImageContextService>(StrategyImageContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SaveClientImageService } from './save-client-image.service';

describe('SaveClientImageService', () => {
  let service: SaveClientImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveClientImageService],
    }).compile();

    service = module.get<SaveClientImageService>(SaveClientImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

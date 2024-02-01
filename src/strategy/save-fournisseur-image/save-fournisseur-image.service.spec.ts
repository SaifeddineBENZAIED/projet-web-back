import { Test, TestingModule } from '@nestjs/testing';
import { SaveFournisseurImageService } from './save-fournisseur-image.service';

describe('SaveFournisseurImageService', () => {
  let service: SaveFournisseurImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveFournisseurImageService],
    }).compile();

    service = module.get<SaveFournisseurImageService>(SaveFournisseurImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

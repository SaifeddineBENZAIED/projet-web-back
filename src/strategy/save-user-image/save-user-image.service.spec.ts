import { Test, TestingModule } from '@nestjs/testing';
import { SaveUserImageService } from './save-user-image.service';

describe('SaveUserImageService', () => {
  let service: SaveUserImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveUserImageService],
    }).compile();

    service = module.get<SaveUserImageService>(SaveUserImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

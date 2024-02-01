import { Test, TestingModule } from '@nestjs/testing';
import { SaveArticleImageService } from './save-article-image.service';

describe('SaveArticleImageService', () => {
  let service: SaveArticleImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveArticleImageService],
    }).compile();

    service = module.get<SaveArticleImageService>(SaveArticleImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

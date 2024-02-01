import { Test, TestingModule } from '@nestjs/testing';
import { CommandeClientService } from './commande-client.service';

describe('CommandeClientService', () => {
  let service: CommandeClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandeClientService],
    }).compile();

    service = module.get<CommandeClientService>(CommandeClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

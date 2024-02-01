import { Test, TestingModule } from '@nestjs/testing';
import { CommandeFournisseurService } from './commande-fournisseur.service';

describe('CommandeFournisseurService', () => {
  let service: CommandeFournisseurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandeFournisseurService],
    }).compile();

    service = module.get<CommandeFournisseurService>(CommandeFournisseurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

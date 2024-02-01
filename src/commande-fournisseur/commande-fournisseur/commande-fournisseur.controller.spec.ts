import { Test, TestingModule } from '@nestjs/testing';
import { CommandeFournisseurController } from './commande-fournisseur.controller';

describe('CommandeFournisseurController', () => {
  let controller: CommandeFournisseurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandeFournisseurController],
    }).compile();

    controller = module.get<CommandeFournisseurController>(CommandeFournisseurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

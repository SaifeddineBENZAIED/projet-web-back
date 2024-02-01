import { Test, TestingModule } from '@nestjs/testing';
import { CommandeClientController } from './commande-client.controller';

describe('CommandeClientController', () => {
  let controller: CommandeClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandeClientController],
    }).compile();

    controller = module.get<CommandeClientController>(CommandeClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

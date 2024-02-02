import { Module } from '@nestjs/common';
import { CommandeClientService } from './commande-client/commande-client.service';
import { CommandeClientController } from './commande-client/commande-client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandeClientEntity } from './commande-client-entity/commande-client-entity';
import { LigneCommandeClientEntity } from 'src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity';
import { ArticleModule } from 'src/article/article.module';
import { StockModule } from 'src/stock/stock.module';
import { ClientModule } from 'src/client/client.module';
import { MailService } from 'src/mailing/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommandeClientEntity, LigneCommandeClientEntity]),
    ArticleModule,
    StockModule,
    ClientModule,
  ],
  providers: [CommandeClientService, MailService],
  controllers: [CommandeClientController],
})
export class CommandeClientModule {}

import { Module } from '@nestjs/common';
import { CommandeFournisseurService } from './commande-fournisseur/commande-fournisseur.service';
import { CommandeFournisseurController } from './commande-fournisseur/commande-fournisseur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandeFournisseurEntity } from './commande-fournisseur-entity/commande-fournisseur-entity';
import { LigneCommandeFournisseurEntity } from 'src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';
import { ArticleModule } from 'src/article/article.module';
import { FournisseurModule } from 'src/fournisseur/fournisseur.module';
import { StockModule } from 'src/stock/stock.module';
import { UserModule } from 'src/user/user.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandeFournisseurEntity,
      LigneCommandeFournisseurEntity,
    ]),
    ArticleModule,
    FournisseurModule,
    StockModule,
    UserModule,
    ClientModule,
  ],
  providers: [CommandeFournisseurService],
  controllers: [CommandeFournisseurController],
})
export class CommandeFournisseurModule {}

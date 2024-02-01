import { Module } from '@nestjs/common';
import { ArticleService } from './article/article.service';
import { ArticleController } from './article/article.controller';
import { ArticleEntity } from './article-entity/article-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigneCommandeClientEntity } from 'src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity';
import { LigneCommandeFournisseurEntity } from 'src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';
import { StockEntity } from 'src/stock/stock-entity/stock-entity';
import { UserModule } from 'src/user/user.module';
import { ClientModule } from 'src/client/client.module';
import { SaveArticleImageService } from 'src/strategy/save-article-image/save-article-image.service';
import { FlickrModule } from 'src/flickr/flickr.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      LigneCommandeClientEntity,
      LigneCommandeFournisseurEntity,
      StockEntity,
    ]),
    UserModule,
    ClientModule,
    FlickrModule,
  ],
  providers: [ArticleService, SaveArticleImageService],
  controllers: [ArticleController],
  exports: [ArticleService, SaveArticleImageService],
})
export class ArticleModule {}

import { Module } from '@nestjs/common';
import { FournisseurService } from './fournisseur/fournisseur.service';
import { FournisseurController } from './fournisseur/fournisseur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FournisseurEntity } from './fournisseur-entity/fournisseur-entity';
import { UserModule } from 'src/user/user.module';
import { ClientModule } from 'src/client/client.module';
import { SaveFournisseurImageService } from 'src/strategy/save-fournisseur-image/save-fournisseur-image.service';
import { FlickrModule } from 'src/flickr/flickr.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FournisseurEntity]),
    UserModule,
    ClientModule,
    FlickrModule,
  ],
  providers: [FournisseurService, SaveFournisseurImageService],
  controllers: [FournisseurController],
  exports: [FournisseurService, SaveFournisseurImageService],
})
export class FournisseurModule {}

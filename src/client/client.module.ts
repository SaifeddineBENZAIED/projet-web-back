/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './client-entity/client-entity';
import { ClientService } from './client/client.service';
import { ClientController } from './client/client.controller';
import { TokenEntity } from 'src/token/token-entity/token-entity';
import { SaveClientImageService } from 'src/strategy/save-client-image/save-client-image.service';
import { FlickrModule } from 'src/flickr/flickr.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity, TokenEntity]), FlickrModule],
  providers: [ClientService, SaveClientImageService],
  controllers: [ClientController],
  exports: [ClientService, SaveClientImageService],
})
export class ClientModule {}

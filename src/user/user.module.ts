import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user-entity/user-entity';
import { TokenEntity } from 'src/token/token-entity/token-entity';
import { ClientModule } from 'src/client/client.module';
import { SaveUserImageService } from 'src/strategy/save-user-image/save-user-image.service';
import { FlickrModule } from 'src/flickr/flickr.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    ClientModule,
    FlickrModule,
  ],
  providers: [UserService, SaveUserImageService],
  controllers: [UserController],
  exports: [UserService, SaveUserImageService],
})
export class UserModule {}

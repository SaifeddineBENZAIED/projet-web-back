import { Module } from '@nestjs/common';
import { TokenService } from './token/token.service';
import { TokenController } from './token/token.controller';
import { TokenEntity } from './token-entity/token-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user-entity/user-entity';
import { ClientEntity } from 'src/client/client-entity/client-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity, UserEntity, ClientEntity])],
  providers: [TokenService],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}

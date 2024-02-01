import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserModule } from 'src/user/user.module';
import { ClientModule } from 'src/client/client.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ClientModule, JwtModule, TokenModule, ConfigModule],
  providers: [AuthenticationService, JwtService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, JwtService],
})
export class AuthenticationModule {}

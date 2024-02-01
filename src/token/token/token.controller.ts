/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TokenEntity } from '../token-entity/token-entity';
import { TokenService } from './token.service';
import { UserEntity } from 'src/user/user-entity/user-entity';
import { ClientEntity } from 'src/client/client-entity/client-entity';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('/create/user-token')
  async createUserToken(@Body() tokenData: TokenEntity): Promise<TokenEntity> {
    return this.tokenService.saveUserToken(tokenData);
  }

  @Post('/create/client-token')
  async createClientToken(@Body() tokenData: TokenEntity): Promise<TokenEntity> {
    return this.tokenService.saveClientToken(tokenData);
  }

  @Get('/find/user-tokens/:id')
  async getTokenByUserId(@Param('id') id: number): Promise<TokenEntity[]> {
    return this.tokenService.findAllValidTokensByUserId(id);
  }

  @Get('/find/client-tokens/:id')
  async getTokensByClientId(@Param('id') clientId: number): Promise<TokenEntity[]> {
    return this.tokenService.findAllValidTokensByClientId(clientId);
  }

  @Get('/find/:token')
  async getTokenByTokenString(@Param('token') tokenString: string): Promise<TokenEntity | undefined> {
    return this.tokenService.findByToken(tokenString);
  }

  @Put('/save/all')
  async saveMultipleTokens(@Body() tokens: TokenEntity[]): Promise<TokenEntity[]> {
    return this.tokenService.saveAll(tokens);
  }

  @Get('/type-token/:token')
  IsTokenTypeIsUser(@Param('token') token: string): Promise<boolean> {
    return this.tokenService.isTokenForUser(token);
  }

  @Get('/validate/:token')
  IsTokenValid(@Param('token') token: string): Promise<boolean> {
    return this.tokenService.verifyToken(token);
  }

  @Get('/find-user/:token')
  async findUserByToken(@Param('token') token: string): Promise<UserEntity> {
    return this.tokenService.findUserByToken(token);
  }

  @Get('/find-client/:token')
  async findClientByToken(@Param('token') token: string): Promise<ClientEntity> {
    return this.tokenService.findClientByToken(token);
  }
}

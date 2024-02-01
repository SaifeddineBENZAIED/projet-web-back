/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from '../token-entity/token-entity';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/user-entity/user-entity';
import { ClientEntity } from 'src/client/client-entity/client-entity';
import { UpdateTokenDto } from '../token-dto/update-token-dto';

@Injectable()
export class TokenService {
  secret = 'Kl3Fxb2G9s4TzZ6R8f5sRmVrN3yKp2UqW8cYd8gF2a7e5tC7h2a0i9n3gT4h5i9s1i8s';
  secretExpiration = '86400000';
  refreshExpiration = '604800000';

  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async saveUserToken(token: TokenEntity): Promise<TokenEntity> {
    return await this.tokenRepository.save(token);
  }

  async saveClientToken(token: TokenEntity): Promise<TokenEntity> {
    const createdToken = this.tokenRepository.create(token);
    return await this.tokenRepository.save(createdToken);
  }

  async updateUserToken(jwt: string, updateTokenDto: UpdateTokenDto): Promise<TokenEntity> {
    const token = await this.findByToken(jwt);
    const updatedToken = Object.assign(token, updateTokenDto);
    return await this.tokenRepository.save(updatedToken);
  }

  async updateClientToken(jwt: string, updateTokenDto: UpdateTokenDto): Promise<TokenEntity> {
    const token = await this.findByToken(jwt);
    const updatedToken = Object.assign(token, updateTokenDto);
    return await this.tokenRepository.save(updatedToken);
  }

  async findAllValidTokensByUserId(id: number): Promise<TokenEntity[]> {
    return this.tokenRepository.createQueryBuilder('token')
      .innerJoin('token.user', 'user')
      .where('user.id = :id', { id })
      .andWhere('token.expired = false')
      .andWhere('token.revoked = false')
      .getMany();
  }

  async findAllValidTokensByClientId(id: number): Promise<TokenEntity[]> {
    return this.tokenRepository.createQueryBuilder('token')
      .innerJoin('token.client', 'client')
      .where('client.id = :id', { id })
      .andWhere('token.expired = false')
      .andWhere('token.revoked = false')
      .getMany();
  }

  async findByToken(tokenString: string): Promise<TokenEntity | undefined> {
    return this.tokenRepository.findOne({ where: { token: tokenString } });
  }

  async saveAll(tokens: TokenEntity[]): Promise<TokenEntity[]> {
    return this.tokenRepository.save(tokens);
  }


  async isTokenForUser(token: string): Promise<boolean> {
    const tokenEntity = await this.findByToken(token);
    
    if (this.isUserToken(tokenEntity)) {
      return true;
    }
    
    return false;
  }

  isUserToken(token: TokenEntity): boolean {
    return !!token.user;
  }

  isClientToken(token: TokenEntity): boolean {
    return !!token.client;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, this.secret);

      const tokenEntity = await this.findByToken(token);

      if (tokenEntity.expired == true || tokenEntity.revoked == true || !decoded) {
        console.log('The token is expired or revoked.');
        return false;
      }

      return true;
    } catch (error) {
      console.log('Verification failed: ', error.message);
      return false;
    }
  }

  async findUserByToken(token: string): Promise<UserEntity | undefined> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    return tokenEntity?.user;
  }

  async findClientByToken(token: string): Promise<ClientEntity | undefined> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { token },
      relations: ['client'],
    });
    return tokenEntity?.client;
  }
}

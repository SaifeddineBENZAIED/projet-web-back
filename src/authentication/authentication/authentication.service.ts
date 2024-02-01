/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, sign } from 'jsonwebtoken';
import { ClientService } from 'src/client/client/client.service';
import { TokenService } from 'src/token/token/token.service';
import { UserService } from 'src/user/user/user.service';
import { AuthenticationResponse } from '../authentication-response';
import { UserDto } from 'src/user/user-dto/user-dto';
import { TokenEntity } from 'src/token/token-entity/token-entity';
import { ClientDto } from 'src/client/client-dto/client-dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/login-dto';

@Injectable()
export class AuthenticationService {
  /*secret = this.configService.get<string>('JWT_SECRET');
  secretExpiration = this.configService.get<string>('JWT_EXPIRATION');
  refreshExpiration = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION');*/
  secret = 'Kl3Fxb2G9s4TzZ6R8f5sRmVrN3yKp2UqW8cYd8gF2a7e5tC7h2a0i9n3gT4h5i9s1i8s';
  secretExpiration = '86400000';
  refreshExpiration = '604800000';

  constructor(
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  generateToken(payload: JwtPayload): string {
    const accessToken = sign({ payload: payload }, this.secret, {
      expiresIn: this.secretExpiration,
    });
    /*const accessToken = this.jwtService.sign(payload, {
      secret: this.secret,
      expiresIn: this.secretExpiration,
    });*/
    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload): string {
    const refreshToken = sign({ payload: payload }, this.secret, {
      expiresIn: this.refreshExpiration,
    });
    /*const refreshToken = this.jwtService.sign(payload, {
      secret: this.secret,
      expiresIn: this.refreshExpiration,
    });*/
    return refreshToken;
  }

  async register(userDto: UserDto): Promise<AuthenticationResponse> {
    const user = await this.userService.save(userDto);

    const payload: JwtPayload = {
      username: user.email,
      sub: user.id.toString(),
    };
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    this.saveUserToken(user.id, accessToken);

    const authenticationResponse = new AuthenticationResponse();
    authenticationResponse.accessToken = accessToken;
    authenticationResponse.refreshToken = refreshToken;

    return authenticationResponse;
  }

  async authenticate(userLoginDto: LoginDto): Promise<AuthenticationResponse> {
    const user = await this.userService.findByEmail(userLoginDto.email);
    if (
      !user ||
      !(await bcrypt.compare(userLoginDto.motDePasse, user.motDePasse))
    ) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload: JwtPayload = {
      username: user.email,
      sub: user.id.toString(),
    };
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    this.revokeAllUserTokens(user.id);
    this.saveUserToken(user.id, accessToken);

    const authenticationResponse = new AuthenticationResponse();
    authenticationResponse.accessToken = accessToken;
    authenticationResponse.refreshToken = refreshToken;

    return authenticationResponse;
  }

  async saveUserToken(userId: number, jwtToken: string): Promise<void> {
    const user = await this.userService.findOne(userId);
    const token = new TokenEntity();
    token.user = user;
    token.token = jwtToken;
    token.revoked = false;
    token.expired = false;
    this.tokenService.saveUserToken(token);
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    const tokens = await this.tokenService.findAllValidTokensByUserId(userId);
    if (tokens.length === 0) return;

    tokens.forEach((token) => {
      token.expired = true;
      token.revoked = true;
    });
    await this.tokenService.saveAll(tokens);
  }

  async refreshToken(request: Request, response: Response): Promise<void> {
    const authHeader = request.headers['authorization'];
    const refreshToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;
    const userEmail = refreshToken
      ? this.jwtService.decode(refreshToken)?.['username']
      : null;

    if (!userEmail) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findByEmail(userEmail);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const userDetails = { username: user.email, userId: user.id };
    if (
      this.jwtService.verify(refreshToken, { secret: this.secret })
    ) {
      const accessToken = this.jwtService.sign(userDetails);
      await this.revokeAllUserTokens(user.id);
      await this.saveUserToken(user.id, accessToken);

      response.json({
        accessToken,
        refreshToken,
      });
    } else {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(req: Request): Promise<void> {
    const authHeader = req.headers['authorization'];
    const jwt = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!jwt) {
      throw new UnauthorizedException('No token provided');
    }

    const storedToken = await this.tokenService.findByToken(jwt);
    if (storedToken) {
      storedToken.expired = true;
      storedToken.revoked = true;
      await this.tokenService.updateUserToken(jwt, storedToken);
    }
  }

  async registerClient(clientDto: ClientDto): Promise<AuthenticationResponse> {
    const client = await this.clientService.create(clientDto);

    const payload: JwtPayload = {
      username: client.email,
      sub: client.id.toString(),
    };
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    this.revokeAllClientTokens(client.id);
    this.saveClientToken(client.id, accessToken);

    const authenticationResponse = new AuthenticationResponse();
    authenticationResponse.accessToken = accessToken;
    authenticationResponse.refreshToken = refreshToken;

    return authenticationResponse;
  }

  async authenticateClient(clientLoginDto: LoginDto): Promise<AuthenticationResponse> {
    const client = await this.clientService.findByEmail(clientLoginDto.email);
    if (
      !client ||
      !(await bcrypt.compare(clientLoginDto.motDePasse, client.motDePasse))
    ) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload: JwtPayload = {
      username: client.email,
      sub: client.id.toString(),
    };
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    this.revokeAllClientTokens(client.id);
    this.saveClientToken(client.id, accessToken);

    const authenticationResponse = new AuthenticationResponse();
    authenticationResponse.accessToken = accessToken;
    authenticationResponse.refreshToken = refreshToken;

    return authenticationResponse;
  }

  async saveClientToken(clientId: number, jwtToken: string): Promise<void> {
    const client = await this.clientService.findOne(clientId);
    const token = new TokenEntity();
    token.client = client;
    token.token = jwtToken;
    token.revoked = false;
    token.expired = false;
    this.tokenService.saveClientToken(token);
  }

  async revokeAllClientTokens(clientId: number): Promise<void> {
    const tokens = await this.tokenService.findAllValidTokensByClientId(clientId);
    if (tokens.length === 0) return;

    tokens.forEach((token) => {
      token.expired = true;
      token.revoked = true;
    });
    await this.tokenService.saveAll(tokens);
  }

  async refreshTokenClient(request: Request, response: Response): Promise<void> {
    const authHeader = request.headers['authorization'];
    const refreshToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;
    const clientEmail = refreshToken
      ? this.jwtService.decode(refreshToken)?.['username']
      : null;

    if (!clientEmail) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const client = await this.clientService.findByEmail(clientEmail);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.UNAUTHORIZED);
    }

    const userDetails = { username: client.email, clientId: client.id };
    if (
      this.jwtService.verify(refreshToken, { secret: this.secret })
    ) {
      const accessToken = this.jwtService.sign(userDetails);
      await this.revokeAllClientTokens(client.id);
      await this.saveClientToken(client.id, accessToken);

      response.json({
        accessToken,
        refreshToken,
      });
    } else {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logoutClient(req: Request): Promise<void> {
    const authHeader = req.headers['authorization'];
    const jwt = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!jwt) {
      throw new UnauthorizedException('No token provided');
    }

    const storedToken = await this.tokenService.findByToken(jwt);
    if (storedToken) {
      storedToken.expired = true;
      storedToken.revoked = true;
      await this.tokenService.updateClientToken(jwt, storedToken);
    }
  }
}

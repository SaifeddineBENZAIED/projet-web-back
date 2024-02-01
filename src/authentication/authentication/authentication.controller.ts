/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Req,
    Res,
    Put,
    ValidationPipe,
  } from '@nestjs/common';
  import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { ClientDto } from 'src/client/client-dto/client-dto';
import { UserDto } from 'src/user/user-dto/user-dto';
import { LoginDto } from 'src/login-dto';
  
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  
  @Post('/register')
  async register(@Body(new ValidationPipe()) userDto: UserDto) {
    return this.authService.register(userDto);
  }
  
  @Post('/login')
  async login(@Body(new ValidationPipe()) userLoginDto: LoginDto) {
    return this.authService.authenticate(userLoginDto);
  }
  
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res() response: Response) {
    await this.authService.refreshToken(request, response);
  }

  @Put('/logout')
  async logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
  
  @Post('/register-client')
  async registerClient(@Body(new ValidationPipe()) clientDto: ClientDto) {
    return this.authService.registerClient(clientDto);
  }
  
  @Post('/login-client')
  async loginClient(@Body() clientLoginDto: LoginDto) {
    return this.authService.authenticateClient(clientLoginDto);
  }
  
  @Post('/refresh-client')
  @HttpCode(HttpStatus.OK)
  async refreshClient(@Req() request: Request, @Res() response: Response) {
    await this.authService.refreshTokenClient(request, response);
  }

  @Put('/logout-client')
  async logoutClient(@Req() request: Request) {
    return this.authService.logoutClient(request);
  }
}
  
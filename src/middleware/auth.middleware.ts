/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { TokenService } from 'src/token/token/token.service';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //const authHeader = req.headers.authorization;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (!token || Array.isArray(token)) {
        return res
          .status(401)
          .json({ message: 'Unauthorized - Token missing or invalid' });
      }

      try {
        const secretKey = 'Kl3Fxb2G9s4TzZ6R8f5sRmVrN3yKp2UqW8cYd8gF2a7e5tC7h2a0i9n3gT4h5i9s1i8s';
        const decodedToken: any = verify(token, secretKey);
        //const decodedToken: any = this.tokenService.verifyToken(token);
        //const validateToken = this.tokenService.verifyToken(token);

        if (decodedToken && decodedToken.payload /*&& decodedToken.username && validateToken*/) {
          /*const user = await this.tokenService.findUserByToken(token);
          if(user){
            req['username'] = user.email;
            req['skipAuth'] = true;
            next();
          }else{
            const client = await this.tokenService.findClientByToken(token);
            req['username'] = client.email;
            req['skipAuth'] = true;
            next();
          }*/
          req['payload'] = decodedToken.payload;
          req['skipAuth'] = true;
          next();
          
        } else {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'Unauthorized - Invalid token content' });
        }
      } catch (error) {
        return res
          .status(401)
          .json({ message: 'Unauthorized - Invalid token signature' });
      }
    }
  }
}

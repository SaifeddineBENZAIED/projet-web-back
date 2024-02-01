/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtil {
  constructor(
    private jwtService: JwtService,
  ) {}

  extractUsername(token: string): string {
    const decoded = this.jwtService.decode(token) as any; // Typecasting for demonstration
    return decoded?.sub; // 'sub' is standard for subject in JWT
  }

  extractExpiration(token: string): Date {
    const decoded = this.jwtService.decode(token) as any;
    return new Date(decoded?.exp * 1000); // JWT exp is in seconds
  }

  generateToken(userDetails: any): string {
    const payload = { username: userDetails.email, sub: userDetails.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10h', // Or fetch from config
    });
  }

  generateRefreshToken(userDetails: any): string {
    const payload = { username: userDetails.email, sub: userDetails.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d', // Or fetch from config
    });
  }

  validateToken(token: string, userDetails: any): boolean {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded?.username === userDetails.email; // Validate user
    } catch (error) {
      return false;
    }
  }

  createToken(claims: any, userDetails: any, expiresIn: string | number): string {
    const payload = { ...claims, username: userDetails.email, sub: userDetails.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn,
    });
  }

  isTokenExpired(token: string): boolean {
    const expiration = this.extractExpiration(token);
    return expiration < new Date();
  }

  // ... Other methods
}

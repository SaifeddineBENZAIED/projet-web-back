/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ClientDto } from 'src/client/client-dto/client-dto';
import { TokenType } from 'src/type-token';
import { UserDto } from 'src/user/user-dto/user-dto';

export class TokenDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsOptional()
    @IsEnum(TokenType)
    tokenType: TokenType;

    @IsBoolean()
    revoked: boolean;

    @IsBoolean()
    expired: boolean;

    user: UserDto;

    client: ClientDto;
}

/* eslint-disable prettier/prettier */

import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length } from "class-validator";
import { Role } from "src/role";
import { TokenEntity } from "src/token/token-entity/token-entity";

export class ClientDto{

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    nom: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    prenom: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    adresse: string;

    @IsNotEmpty()
    @IsEmail()
    @Length(1, 100)
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('TN')
    numTelephone: string;

    @IsOptional()
    @IsEnum(Role)
    role: Role;

    @IsNotEmpty()
    @IsStrongPassword()
    motDePasse: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    tokens: TokenEntity[];
}

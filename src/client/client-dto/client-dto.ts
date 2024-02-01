/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length } from "class-validator";
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
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('TN')
    numTelephone: string;

    @IsNotEmpty()
    @IsStrongPassword()
    motDePasse: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    tokens: TokenEntity[];
}

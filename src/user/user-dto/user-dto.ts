/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsDateString, IsStrongPassword, IsNumber } from "class-validator";
import { Role } from "src/role";
import { TokenEntity } from "src/token/token-entity/token-entity";

export class UserDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsNotEmpty()
    @IsString()
    prenom: string;

    @IsNotEmpty()
    @IsString()
    adresse: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    numTelephone: string;

    @IsNotEmpty()
    @IsDateString()
    dateNaissance: Date;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    motDePasse: string;

    @IsNotEmpty()
    role: Role;

    @IsOptional()
    tokens: TokenEntity[];
}

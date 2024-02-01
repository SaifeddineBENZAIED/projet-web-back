/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty, IsOptional, Length, IsNumber } from 'class-validator';

export class FournisseurDto {

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
    @IsString()
    image: string;
}

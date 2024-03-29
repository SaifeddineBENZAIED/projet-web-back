/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    motDePasse: string;
}

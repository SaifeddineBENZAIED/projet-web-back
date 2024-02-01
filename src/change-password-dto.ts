/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsStrongPassword()
    motDePasse: string;

    @IsNotEmpty()
    @IsStrongPassword()
    confirmMotDePasse: string;
}
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";
import { TypeArticle } from "src/type-article";

export class ArticleDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    nomArticle: string;

    @IsNotEmpty()
    @IsString()
    codeArticle: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    prixUnitaireHT: number;

    @IsNotEmpty()
    @IsNumber()
    tauxTVA: number;

    @IsNotEmpty()
    typeArticle: TypeArticle;

    @IsOptional()
    @IsString()
    image: string;
}

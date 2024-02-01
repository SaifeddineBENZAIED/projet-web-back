/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsNotEmpty, IsDate, IsNumber, ValidateNested, IsEnum, IsOptional } from "class-validator";
import { ArticleEntity } from "src/article/article-entity/article-entity";
import { SourceMvmntStock } from "src/source-mvmnt-stock";
import { TypedeMvmntStock } from "src/type-mvmnt-stock";

export class StockDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsDate()
    dateMvmnt: Date;

    @IsNotEmpty()
    @IsNumber()
    quantite: number;

    @IsNotEmpty()
    @Type(() => ArticleEntity)
    @ValidateNested()
    article: ArticleEntity;

    @IsNotEmpty()
    @IsEnum(TypedeMvmntStock)
    typeMvmntStck: TypedeMvmntStock;

    @IsNotEmpty()
    @IsEnum(SourceMvmntStock)
    sourceMvmntStck: SourceMvmntStock;
}

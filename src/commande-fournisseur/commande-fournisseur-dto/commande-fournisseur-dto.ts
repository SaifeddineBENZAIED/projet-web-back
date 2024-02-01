/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsEnum,
  ValidateNested,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { EtatCommande } from 'src/etat-commande';
import { FournisseurEntity } from 'src/fournisseur/fournisseur-entity/fournisseur-entity';
import { LigneCommandeFournisseurEntity } from 'src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';

export class CommandeFournisseurDto {

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  codeCF: string;

  @IsNotEmpty()
  @IsDate()
  dateCommande: Date;

  @IsNotEmpty()
  @IsEnum(EtatCommande)
  etatCommande: EtatCommande;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FournisseurEntity)
  fournisseur: FournisseurEntity;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneCommandeFournisseurEntity)
  ligneCommandeFournisseurs: LigneCommandeFournisseurEntity[];
}

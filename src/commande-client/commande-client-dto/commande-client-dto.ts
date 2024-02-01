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
import { ClientEntity } from 'src/client/client-entity/client-entity';
import { EtatCommande } from 'src/etat-commande';
import { LigneCommandeClientEntity } from 'src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity';

export class CommandeClientDto {

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  codeCC: string;

  @IsNotEmpty()
  @IsDate()
  dateCommande: Date;

  @IsNotEmpty()
  @IsEnum(EtatCommande)
  etatCommande: EtatCommande;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClientEntity)
  client: ClientEntity;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneCommandeClientEntity)
  ligneCommandeClients: LigneCommandeClientEntity[];
}

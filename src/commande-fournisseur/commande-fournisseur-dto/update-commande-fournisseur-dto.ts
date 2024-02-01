/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CommandeFournisseurDto } from './commande-fournisseur-dto';

export class UpdateCommandeFournisseurDto extends PartialType(CommandeFournisseurDto) {}

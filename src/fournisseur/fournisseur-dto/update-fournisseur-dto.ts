/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { FournisseurDto } from './fournisseur-dto';

export class UpdateFournisseurDto extends PartialType(FournisseurDto) {}

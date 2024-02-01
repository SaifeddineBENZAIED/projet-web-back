/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CommandeClientDto } from './commande-client-dto';

export class UpdateCommandeClientDto extends PartialType(CommandeClientDto) {}

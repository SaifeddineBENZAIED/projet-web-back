/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigneCommandeFournisseurEntity } from './ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';

@Module({
  imports: [TypeOrmModule.forFeature([LigneCommandeFournisseurEntity])],
})
export class LigneCommandeFournisseurModule {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigneCommandeClientEntity } from './ligne-commande-client-entity/ligne-commande-client-entity';

@Module({
  imports: [TypeOrmModule.forFeature([LigneCommandeClientEntity])],
})
export class LigneCommandeClientModule {}

/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { EtatCommande } from "src/etat-commande";
import { FournisseurEntity } from "src/fournisseur/fournisseur-entity/fournisseur-entity";
import { LigneCommandeFournisseurEntity } from "src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('commande_fournisseur')
export class CommandeFournisseurEntity extends AbstractEntity{
    @Column({ unique: true })
    codeCF: string;

    @Column()
    dateCommande: Date;

    @Column()
    etatCommande: EtatCommande;

    @ManyToOne(() => FournisseurEntity)
    fournisseur: FournisseurEntity;

    @OneToMany(() => LigneCommandeFournisseurEntity, (ligneCommandeFournisseur) => ligneCommandeFournisseur.commandeFournisseur, { cascade: true })
    ligneCommandeFournisseurs: LigneCommandeFournisseurEntity[];
}

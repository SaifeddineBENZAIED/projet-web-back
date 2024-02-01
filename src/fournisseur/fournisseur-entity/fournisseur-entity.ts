/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { CommandeFournisseurEntity } from "src/commande-fournisseur/commande-fournisseur-entity/commande-fournisseur-entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('fournisseur')
export class FournisseurEntity extends AbstractEntity{
    @Column({ length: 50 })
    nom: string;

    @Column({ length: 50 })
    prenom: string;

    @Column({ length: 100 })
    adresse: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 15 })
    numTelephone: string;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => CommandeFournisseurEntity, commande => commande.fournisseur, { eager: false })
    commandes: CommandeFournisseurEntity[];
}

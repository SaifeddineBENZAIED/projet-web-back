/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { ArticleEntity } from "src/article/article-entity/article-entity";
import { CommandeFournisseurEntity } from "src/commande-fournisseur/commande-fournisseur-entity/commande-fournisseur-entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('ligne_commande_fournisseur')
export class LigneCommandeFournisseurEntity extends AbstractEntity{
    @ManyToOne(() => ArticleEntity)
    article: ArticleEntity;

    @ManyToOne(() => CommandeFournisseurEntity)
    commandeFournisseur: CommandeFournisseurEntity;

    @Column()
    quantite: number;

    @Column()
    prixUnitaire: number;
}

/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { ArticleEntity } from "src/article/article-entity/article-entity";
import { CommandeClientEntity } from "src/commande-client/commande-client-entity/commande-client-entity";
import { ManyToOne, Column, Entity } from "typeorm";

@Entity('ligne_commande_client')
export class LigneCommandeClientEntity extends AbstractEntity{
    @ManyToOne(() => ArticleEntity)
    article: ArticleEntity;

    @ManyToOne(() => CommandeClientEntity)
    commandeClient: CommandeClientEntity;

    @Column()
    quantite: number;

    @Column()
    prixUnitaire: number;
}

/* eslint-disable prettier/prettier */

import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { LigneCommandeClientEntity } from "src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity";
import { LigneCommandeFournisseurEntity } from "src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity";
import { StockEntity } from "src/stock/stock-entity/stock-entity";
import { TypeArticle } from "src/type-article";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('article')
export class ArticleEntity extends AbstractEntity{
    @Column({ unique: true })
    nomArticle: string;

    @Column({ unique: true })
    codeArticle: string;

    @Column()
    description: string;

    @Column()
    prixUnitaireHT: number;

    @Column()
    tauxTVA: number;

    @Column()
    prixUnitaireTTC: number;

    @Column({ type: 'enum', enum: TypeArticle })
    type: TypeArticle;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => LigneCommandeClientEntity, (ligneCommandeClient) => ligneCommandeClient.article)
    ligneCommandeClients: LigneCommandeClientEntity[];

    @OneToMany(() => LigneCommandeFournisseurEntity, (ligneCommandeFournisseur) => ligneCommandeFournisseur.article)
    ligneCommandeFournisseurs: LigneCommandeFournisseurEntity[];

    @OneToMany(() => StockEntity, (mvmntStck) => mvmntStck.article)
    stock: StockEntity[];
}

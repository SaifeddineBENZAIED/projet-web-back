/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { ArticleEntity } from "src/article/article-entity/article-entity";
import { SourceMvmntStock } from "src/source-mvmnt-stock";
import { TypedeMvmntStock } from "src/type-mvmnt-stock";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('stock')
export class StockEntity extends AbstractEntity{
    @Column()
    dateMvmnt: Date;

    @Column()
    quantite: number;

    @ManyToOne(() => ArticleEntity)
    article: ArticleEntity;

    @Column({ type: 'enum', enum: TypedeMvmntStock })
    typeMvmntStck: TypedeMvmntStock;

    @Column({ type: 'enum', enum: SourceMvmntStock })
    sourceMvmntStck: SourceMvmntStock;
}

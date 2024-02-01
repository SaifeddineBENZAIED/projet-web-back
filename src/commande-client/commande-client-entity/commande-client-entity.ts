/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { ClientEntity } from "src/client/client-entity/client-entity";
import { EtatCommande } from "src/etat-commande";
import { LigneCommandeClientEntity } from "src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity";
import { Column, ManyToOne, OneToMany, Entity } from "typeorm";

@Entity('commande_client')
export class CommandeClientEntity extends AbstractEntity{
    @Column({ unique: true })
    codeCC: string;

    @Column()
    dateCommande: Date;

    @Column()
    etatCommande: EtatCommande;

    @ManyToOne(() => ClientEntity)
    client: ClientEntity;

    @OneToMany(() => LigneCommandeClientEntity, (ligneCommandeClient) => ligneCommandeClient.commandeClient, { cascade: true })
    ligneCommandeClients: LigneCommandeClientEntity[];
}

/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { CommandeClientEntity } from "src/commande-client/commande-client-entity/commande-client-entity";
import { Role } from "src/role";
import { TokenEntity } from "src/token/token-entity/token-entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('client')
export class ClientEntity extends AbstractEntity{
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

    @Column({ length: 30 })
    motDePasse: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: Role.CLIENT })
    role: Role;

    @OneToMany(() => TokenEntity, token => token.client)
    tokens: TokenEntity[];

    @OneToMany(() => CommandeClientEntity, commande => commande.client, { eager: false })
    commandeClients: CommandeClientEntity[];
}

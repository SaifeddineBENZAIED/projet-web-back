/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { Role } from "src/role";
import { TokenEntity } from "src/token/token-entity/token-entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('user')
export class UserEntity extends AbstractEntity {
    @Column()
    nom: string;
  
    @Column()
    prenom: string;
  
    @Column()
    adresse: string;
  
    @Column({ nullable: true })
    image: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ nullable: true })
    numTelephone: string;
  
    @Column()
    dateNaissance: Date;
  
    @Column()
    motDePasse: string;
  
    @Column()
    role: Role;
  
    @OneToMany(() => TokenEntity, token => token.user)
    tokens: TokenEntity[];
}

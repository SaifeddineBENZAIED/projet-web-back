/* eslint-disable prettier/prettier */
import { AbstractEntity } from "src/abstract-entity/abstract-entity";
import { ClientEntity } from "src/client/client-entity/client-entity";
import { TokenType } from "src/type-token";
import { UserEntity } from "src/user/user-entity/user-entity";
import { Column, ManyToOne, Entity } from "typeorm";

@Entity('token')
export class TokenEntity extends AbstractEntity{
    @Column({ unique: true })
    token: string;

    @Column({ type: 'enum', enum: TokenType, default: TokenType.BEARER })
    tokenType: TokenType;

    @Column()
    revoked: boolean;

    @Column()
    expired: boolean;

    @ManyToOne(() => UserEntity, user => user.tokens, { lazy: true })
    user: UserEntity;

    @ManyToOne(() => ClientEntity, client => client.tokens, { lazy: true })
    client: ClientEntity;
}

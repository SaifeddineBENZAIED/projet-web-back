/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../client-entity/client-entity';
import { ClientDto } from '../client-dto/client-dto';
import { UpdateClientDto } from '../client-dto/update-client-dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from 'src/change-password-dto';
import { Role } from 'src/role';

@Injectable()
export class ClientService {
  constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
  ) {}
    
  async create(clientDto: ClientDto): Promise<ClientEntity> {
    if (await this.clientAlreadyExists(clientDto.email)) {
      throw new BadRequestException(
        'Il y\'a déjà un autre client de meme email',
      );
    }
    clientDto.motDePasse = await this.encodePassword(clientDto.motDePasse);
    clientDto.role = Role.CLIENT;
    const client = this.clientRepository.create(clientDto);
    return await this.clientRepository.save(client);
  }

  async encodePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async clientAlreadyExists(email: string): Promise<boolean> {
    const client = await this.clientRepository.findOne({ where: { email } });
    return !!client;
  }
    
  async findAll(): Promise<ClientEntity[]> {
    return await this.clientRepository.find();
  }
    
  async findOne(id: number): Promise<ClientEntity> {
    const client = await this.clientRepository.findOne({ where: { id: id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async findByEmail(email: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findOne({ where: { email: email } });
    if (!client) {
      throw new NotFoundException(`Client with email ${email} not found`);
    }
    return client;
  }
    
  async update(id: number, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    const client = await this.findOne(id);
    const updatedClient = Object.assign(client, updateClientDto);
    return await this.clientRepository.save(updatedClient);
  }
    
  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<ClientEntity> {
    if (!changePasswordDto) {
      throw new BadRequestException(
        'Aucune information n\'a été fournie pour pouvoir changer le mot de passe',
      );
    }

    if (!changePasswordDto.id) {
      throw new BadRequestException('CLIENT ID IS NULL');
    }

    if (!changePasswordDto.motDePasse || !changePasswordDto.confirmMotDePasse) {
      throw new BadRequestException('PASSWORD IS NULL');
    }

    if (changePasswordDto.motDePasse !== changePasswordDto.confirmMotDePasse) {
      throw new BadRequestException('PASSWORD CONFIRMATION IS INCORRECT');
    }

    const client = await this.findOne(changePasswordDto.id);

    if (!client) {
      throw new NotFoundException(
        `Aucun client n'a été trouvé avec l'ID ${changePasswordDto.id}`,
      );
    }

    client.motDePasse = await this.encodePassword(changePasswordDto.motDePasse);
    return await this.clientRepository.save(client);
  }

  async findTopSpendingClients(startDate?: Date, endDate?: Date): Promise<ClientEntity[]> {
    const queryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .leftJoin('client.commandeClients', 'commandeClient')
        .leftJoin('commandeClient.ligneCommandeClients', 'ligneCommandeClient')
        .select('client.id', 'id')
        .addSelect('client.nom', 'nom')
        .addSelect('client.prenom', 'prenom')
        .addSelect('SUM(ligneCommandeClient.prixUnitaire * ligneCommandeClient.quantite)', 'totalDepense')
        .groupBy('client.id')
        .orderBy('totalDepense', 'DESC')
        .take(10);

    if (startDate && endDate) {
        queryBuilder
            .where('commandeClient.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    return queryBuilder.getRawMany();
  }
}

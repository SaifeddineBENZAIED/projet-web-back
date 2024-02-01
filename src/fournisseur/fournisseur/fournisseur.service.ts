/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FournisseurEntity } from '../fournisseur-entity/fournisseur-entity';
import { FournisseurDto } from '../fournisseur-dto/fournisseur-dto';
import { UpdateFournisseurDto } from '../fournisseur-dto/update-fournisseur-dto';

@Injectable()
export class FournisseurService {
    constructor(
        @InjectRepository(FournisseurEntity)
        private readonly fournisseurRepository: Repository<FournisseurEntity>,
      ) {}
    
    async create(fournisseurDto: FournisseurDto): Promise<FournisseurEntity> {
        const fournisseur = this.fournisseurRepository.create(fournisseurDto);
        return await this.fournisseurRepository.save(fournisseur);
    }
        
    async findAll(): Promise<FournisseurEntity[]> {
        return await this.fournisseurRepository.find();
    }
        
    async findOne(id: number): Promise<FournisseurEntity> {
        const fournisseur = await this.fournisseurRepository.findOne({ where: { id: id } });
        if (!fournisseur) {
        throw new NotFoundException(`Fournisseur with ID ${id} not found`);
        }
        return fournisseur;
    }
        
    async update(id: number, updateFournisseurDto: UpdateFournisseurDto): Promise<FournisseurEntity> {
        const fournisseur = await this.findOne(id);
        const updatedFournisseur = Object.assign(fournisseur, updateFournisseurDto);
        return await this.fournisseurRepository.save(updatedFournisseur);
    }
        
    async remove(id: number): Promise<void> {
        const fournisseur = await this.findOne(id);
        await this.fournisseurRepository.remove(fournisseur);
    }
}

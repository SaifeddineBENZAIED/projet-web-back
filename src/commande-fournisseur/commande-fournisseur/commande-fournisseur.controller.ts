/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { EtatCommande } from 'src/etat-commande';
import { CommandeFournisseurDto } from '../commande-fournisseur-dto/commande-fournisseur-dto';
import { CommandeFournisseurService } from './commande-fournisseur.service';
import { LigneCommandeFournisseurEntity } from 'src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';
import { CommandeFournisseurEntity } from '../commande-fournisseur-entity/commande-fournisseur-entity';

@Controller('commande-fournisseur')
export class CommandeFournisseurController {
    constructor(private readonly commandeFournisseurService: CommandeFournisseurService) {}

    @Post('/create')
    async create(@Body() commandeFournisseurDto: CommandeFournisseurDto) {
        return await this.commandeFournisseurService.save(commandeFournisseurDto);
    }

    @Put('/:id/update-etat')
    async updateEtatCommande(@Param('id') id: number, @Body('etatCommande') etatCommande: EtatCommande) {
        return await this.commandeFournisseurService.updateEtatCommande(id, etatCommande);
    }

    @Put('/:idCommande/update-quantite/:idLigneCommande')
    async updateQuantiteCommande(@Param('idCommande') idCommande: number, @Param('idLigneCommande') idLigneCommande: number, @Body('quantite') quantite: number) {
        return await this.commandeFournisseurService.updateQuantiteCommande(idCommande, idLigneCommande, quantite);
    }

    @Put('/:idCommande/update-fournisseur/:idFournisseur')
    async updateFournisseur(@Param('idCommande') idCommande: number, @Param('idFournisseur') idFournisseur: number) {
        return await this.commandeFournisseurService.updateFournisseur(idCommande, idFournisseur);
    }

    @Put('/:idCommande/update-article/:idLigneCommande')
    async updateArticle(@Param('idCommande') idCommande: number, @Param('idLigneCommande') idLigneCommande: number, @Body('newIdArticle') newIdArticle: number) {
        return await this.commandeFournisseurService.updateArticle(idCommande, idLigneCommande, newIdArticle);
    }

    @Delete('/:idCommande/delete-article/:idLigneCommande')
    async deleteArticle(@Param('idCommande') idCommande: number, @Param('idLigneCommande') idLigneCommande: number) {
        return await this.commandeFournisseurService.deleteArticle(idCommande, idLigneCommande);
    }

    @Get('/find/:id')
    async findById(@Param('id') id: number) {
        return await this.commandeFournisseurService.findById(id);
    }

    @Get('/findByCode/:code')
    async findByCode(@Param('code') code: string): Promise<CommandeFournisseurEntity> {
        return this.commandeFournisseurService.findByCodeCF(code);
    }

    @Get('/all')
    async findAll() {
        return await this.commandeFournisseurService.findAll();
    }

    @Get('/all-lignes-commande/:id')
    async findAllLigneCF(@Param('id') id: number): Promise<LigneCommandeFournisseurEntity[]> {
        return this.commandeFournisseurService.findAllLigneCommandeFournisseursByCommandeFournisseurId(id);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: number) {
        return await this.commandeFournisseurService.delete(id);
    }

    @Get('/randomCode/:nom/:prenom')
    async generateRandomCode(@Param('nom') nom: string, @Param('prenom') prenom: string): Promise<{code: string}> {
        const code = await this.commandeFournisseurService.generateUniqueCodeCF(nom, prenom);
        return { code };
    }

    @Get('/by-fournisseur/:idFournisseur')
    findAllCommandesByFournisseurId(@Param('idFournisseur') idFournisseur: number): Promise<CommandeFournisseurEntity[]> {
        return this.commandeFournisseurService.findAllCommandesByFournisseurId(idFournisseur);
    }

    @Put('/update')
    async updateCommande(@Body() commandeFournisseurDto: CommandeFournisseurDto) {

        const commande = await this.commandeFournisseurService.updateCommandeFournisseur(commandeFournisseurDto);
        if (!commande) {
        throw new NotFoundException(`Commande non trouvée`);
        }

        return commande;
    }
}

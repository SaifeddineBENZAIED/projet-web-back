/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { CommandeClientDto } from '../commande-client-dto/commande-client-dto';
import { CommandeClientEntity } from '../commande-client-entity/commande-client-entity';
import { CommandeClientService } from './commande-client.service';
import { EtatCommande } from 'src/etat-commande';
import { LigneCommandeClientEntity } from 'src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity';

@Controller('commande-client')
export class CommandeClientController {
    constructor(private readonly commandeClientService: CommandeClientService) {}

    @Post('/create')
    async create(@Body() commandeClientDto: CommandeClientDto): Promise<CommandeClientEntity> {
        return this.commandeClientService.save(commandeClientDto);
    }

    @Put('/:idCommande/update-etat')
    async updateEtatCommande(@Param('idCommande') idCommande: number, @Body('etatCommande') etatCommande: EtatCommande): Promise<CommandeClientEntity> {
        return this.commandeClientService.updateEtatCommande(idCommande, etatCommande);
    }

    @Put('/:idCommande/update-quantite/:idLigneCommande')
    async updateQuantiteCommande(@Param('idCommande') idCommande: number, @Param('idLigneCommande') idLigneCommande: number, @Body('quantite') quantite: number): Promise<CommandeClientEntity> {
        return this.commandeClientService.updateQuantiteCommande(idCommande, idLigneCommande, quantite);
    }

    @Put('/:idCommande/update-client/:idClient')
    async updateClient(@Param('idCommande') idCommande: number, @Param('idClient') idClient: number): Promise<CommandeClientEntity> {
        return this.commandeClientService.updateClient(idCommande, idClient);
    }

    @Put('/:idCommande/update-article/:idLigneCommande')
    async updateArticle(@Param('idCommande') idCommande: number, @Param('idLigneCommande') idLigneCommande: number, @Body('newIdArticle') newIdArticle: number): Promise<CommandeClientEntity> {
        return this.commandeClientService.updateArticle(idCommande, idLigneCommande, newIdArticle);
    }

    @Delete('/:idCommande/delete-article/:idLigneCommande')
    async deleteArticle(@Param('idCommande') idCommande: number, @Param('idLigneCommande') idLigneCommande: number): Promise<CommandeClientEntity> {
        return this.commandeClientService.deleteArticle(idCommande, idLigneCommande);
    }

    @Get('/find/:id')
    async findOne(@Param('id') id: number): Promise<CommandeClientEntity> {
        return this.commandeClientService.findById(id);
    }

    @Get('/findByCode/:code')
    async findByCode(@Param('code') code: string): Promise<CommandeClientEntity> {
        return this.commandeClientService.findByCodeCC(code);
    }

    @Get('/all')
    async findAll(): Promise<CommandeClientEntity[]> {
        return this.commandeClientService.findAll();
    }

    @Get('/all-lignes-commande/:id')
    async findAllLigneCC(@Param('id') id: number): Promise<LigneCommandeClientEntity[]> {
        return this.commandeClientService.findAllLigneCommandeClientsByCommandeClientId(id);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: number): Promise<boolean> {
        return this.commandeClientService.delete(id);
    }

    @Get('/randomCode/:nom/:prenom')
    async generateRandomCode(@Param('nom') nom: string, @Param('prenom') prenom: string): Promise<{code: string}> {
        const code = await this.commandeClientService.generateUniqueCodeCC(nom, prenom);
        return { code };
    }

    @Get('/by-client/:clientId')
    findAllCommandesByClientId(@Param('clientId') clientId: number): Promise<CommandeClientEntity[]> {
        return this.commandeClientService.findAllCommandesByClientId(clientId);
    }

    @Patch('/update')
    async updateCommande(@Body() commandeClientDto: CommandeClientDto) {

        const commande = await this.commandeClientService.updateCommandeClient(commandeClientDto);
        if (!commande) {
        throw new NotFoundException(`Commande non trouvée`);
        }

        return commande;
    }
}

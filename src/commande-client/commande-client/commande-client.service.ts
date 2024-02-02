/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EtatCommande } from 'src/etat-commande';
import { LigneCommandeClientEntity } from 'src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity';
import { Repository } from 'typeorm';
import { CommandeClientDto } from '../commande-client-dto/commande-client-dto';
import { CommandeClientEntity } from '../commande-client-entity/commande-client-entity';
import { StockService } from 'src/stock/stock/stock.service';
import { ClientService } from 'src/client/client/client.service';
import { StockDto } from 'src/stock/stock-dto/stock-dto';
import { TypedeMvmntStock } from 'src/type-mvmnt-stock';
import { SourceMvmntStock } from 'src/source-mvmnt-stock';
import { ArticleService } from 'src/article/article/article.service';
import { StockEntity } from 'src/stock/stock-entity/stock-entity';
import { MailService } from 'src/mailing/mail/mail.service';

@Injectable()
export class CommandeClientService {
  constructor(
    @InjectRepository(CommandeClientEntity)
    private readonly commandeClientRepository: Repository<CommandeClientEntity>,
    @InjectRepository(LigneCommandeClientEntity)
    private readonly ligneCommandeClientRepository: Repository<LigneCommandeClientEntity>,
    private readonly articleService: ArticleService,
    private readonly stockService: StockService,
    private readonly clientService: ClientService,
    private readonly mailService: MailService,
  ) {}

  async save(commandeClientDto: CommandeClientDto): Promise<CommandeClientEntity> {
    const client = await this.clientService.findOne(commandeClientDto.client.id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${commandeClientDto.client.id} not found`);
    }

    const commandeClient = this.commandeClientRepository.create(commandeClientDto);
    const savedCommandeClient = await this.commandeClientRepository.save(commandeClient);
    
    this.updateStock(savedCommandeClient);

    return savedCommandeClient;
  }

  async updateEtatCommande(
    idCommande: number,
    etatCommande: EtatCommande,
  ): Promise<CommandeClientEntity> {
    if (!idCommande) {
        throw new BadRequestException("Invalid ID");
    }
  
    if (!etatCommande) {
      throw new BadRequestException("EtatCommande is null");
    }
  
    const commandeClient = await this.findById(idCommande);
    if (!commandeClient) {
      throw new NotFoundException(`CommandeClient with ID ${idCommande} not found`);
    }
  
    if (commandeClient.etatCommande === EtatCommande.LIVREE) {
      throw new BadRequestException("Cette commande est déjà livrée");
    }
  
    commandeClient.etatCommande = etatCommande;
    await this.commandeClientRepository.save(commandeClient);
  
    if (commandeClient.etatCommande === EtatCommande.LIVREE) {
      await this.updateMvmntStck(idCommande);
    }

    if(commandeClient.etatCommande === EtatCommande.VALIDEE) {
      await this.notifyClientForCommandeValidation(commandeClient.client.email, commandeClient);
    }

    return commandeClient;
  }

  async notifyClientForCommandeValidation(email: string, cmd: CommandeClientEntity) {

    const htmlContent = `<p>Votre commande avec le code : ${cmd.codeCC}, passée à cette date : ${cmd.dateCommande}, est maintenant validée. Elle est donc prête pour être livrée, ou bien, si vous préférez, vous pouvez venir la récupérer à tout moment.</p>`;
      
    await this.mailService.sendMail(email, 'Commande validée', htmlContent);
    
  }

  async updateQuantiteCommande(
    idCommande: number,
    idLigneCommande: number,
    quantite: number,
  ): Promise<CommandeClientEntity> {
    if (!idCommande) {
      throw new BadRequestException("Invalid Commande ID");
    }
    if (!idLigneCommande) {
      throw new BadRequestException("Invalid Ligne Commande ID");
    }
    if (quantite <= 0) {
      throw new BadRequestException("Quantite must be greater than zero");
    }
    
    const commandeClient = await this.commandeClientRepository.findOne({ where: { id: idCommande } });
    if (!commandeClient) {
      throw new NotFoundException(`CommandeClient with ID ${idCommande} not found`);
    }
    
    if (commandeClient.etatCommande === EtatCommande.LIVREE) {
      throw new BadRequestException("Cette commande est déjà livrée");
    }
    
    const ligneCommandeClient = await this.ligneCommandeClientRepository.findOne({ where: { id: idLigneCommande } });
    if (!ligneCommandeClient) {
      throw new NotFoundException(`LigneCommandeClient with ID ${idLigneCommande} not found`);
    }
    
    ligneCommandeClient.quantite = quantite;
    await this.ligneCommandeClientRepository.save(ligneCommandeClient);

    return commandeClient;
  }

  async updateClient(
    idCommande: number,
    idClient: number,
  ): Promise<CommandeClientEntity> {
    if (!idCommande) {
      throw new BadRequestException("Invalid Commande ID");
    }
    if (!idClient) {
      throw new BadRequestException("Invalid Client ID");
    }
    
    const commandeClient = await this.commandeClientRepository.findOne({ where: { id: idCommande } });
    if (!commandeClient) {
      throw new NotFoundException(`CommandeClient with ID ${idCommande} not found`);
    }
    
    if (commandeClient.etatCommande === EtatCommande.LIVREE) {
      throw new BadRequestException("Cette commande est déjà livrée");
    }
    
    const client = await this.clientService.findOne(idClient);
    if (!client) {
      throw new NotFoundException(`Client with ID ${idClient} not found`);
    }
    
    commandeClient.client = client;
    await this.commandeClientRepository.save(commandeClient);
    
    return commandeClient;
  }

  async updateArticle(
    idCommande: number,
    idLigneCommande: number,
    newIdArticle: number,
  ): Promise<CommandeClientEntity> {
    if (!idCommande) {
      throw new BadRequestException("Invalid Commande ID");
    }
    if (!idLigneCommande) {
      throw new BadRequestException("Invalid Ligne Commande ID");
    }
    if (!newIdArticle) {
      throw new BadRequestException("Invalid Article ID");
    }
    
    const commandeClient = await this.commandeClientRepository.findOne({ where: { id: idCommande } });
    if (!commandeClient) {
      throw new NotFoundException(`CommandeClient with ID ${idCommande} not found`);
    }
    
    if (commandeClient.etatCommande === EtatCommande.LIVREE) {
      throw new BadRequestException("Cette commande est déjà livrée");
    }
    
    const ligneCommandeClient = await this.ligneCommandeClientRepository.findOne({ where: { id: idLigneCommande } });
    if (!ligneCommandeClient) {
      throw new NotFoundException(`LigneCommandeClient with ID ${idLigneCommande} not found`);
    }
    
    const article = await this.articleService.findOne(newIdArticle);
    if (!article) {
      throw new NotFoundException(`Article with ID ${newIdArticle} not found`);
    }
        
    ligneCommandeClient.article = article;
    await this.ligneCommandeClientRepository.save(ligneCommandeClient);
    
    return commandeClient;
  }

  async deleteArticle(
    idCommande: number,
    idLigneCommande: number,
  ): Promise<CommandeClientEntity> {
    if (!idCommande) {
      throw new BadRequestException("Invalid Commande ID");
    }
    if (!idLigneCommande) {
      throw new BadRequestException("Invalid Ligne Commande ID");
    }
    
    const commandeClient = await this.commandeClientRepository.findOne({ where: { id: idCommande } });
    if (!commandeClient) {
      throw new NotFoundException(`CommandeClient with ID ${idCommande} not found`);
    }
    
    if (commandeClient.etatCommande === EtatCommande.LIVREE) {
      throw new BadRequestException("Cette commande est déjà livrée");
    }
    
    const ligneCommandeClient = await this.ligneCommandeClientRepository.findOne({ where: { id: idLigneCommande } });
    if (!ligneCommandeClient) {
      throw new NotFoundException(`LigneCommandeClient with ID ${idLigneCommande} not found`);
    }
    
    await this.ligneCommandeClientRepository.remove(ligneCommandeClient);
    
    return commandeClient;
  }

  async findById(id: number): Promise<CommandeClientEntity> {
    if (!id) {
        throw new BadRequestException('Invalid ID');
    }
  
    const commandeClient = await this.commandeClientRepository.findOne({ where: { id: id }, relations: ['client', 'ligneCommandeClients'], });
    if (!commandeClient) {
      throw new NotFoundException(`CommandeClient with ID ${id} not found`);
    }

    return commandeClient;
  }

  async findByCodeCC(codeCC: string): Promise<CommandeClientEntity> {
    if (!codeCC) {
        throw new BadRequestException('Invalid code commande');
    }
  
    const commandeClient = await this.commandeClientRepository.findOne({ where: { codeCC: codeCC }, relations: ['client', 'ligneCommandeClients'], });
    if (!commandeClient) {
      throw new NotFoundException(`CommandeClient with code ${codeCC} not found`);
    }

    return commandeClient;
  }

  async findAll(): Promise<CommandeClientEntity[]> {
    const commandeClients = await this.commandeClientRepository.find({
      relations: ['client', 'ligneCommandeClients'],
    });
    return commandeClients;
  }

  async findAllLigneCommandeClientsByCommandeClientId(
    idCommande: number,
  ): Promise<LigneCommandeClientEntity[]> {
    if (!idCommande) {
      throw new BadRequestException("Invalid Commande ID");
    }
    
    const ligneCommandeClients = await this.ligneCommandeClientRepository.find({
      where: { commandeClient: { id: idCommande } },
      relations: ['commandeClient', 'article'],
    });
    
    return ligneCommandeClients;
  }

  async delete(id: number): Promise<boolean> {
    if (!id) {
      throw new BadRequestException('Invalid ID');
    }
    
    const commandeClient = await this.commandeClientRepository.findOne({ where: { id: id } });
    if (!commandeClient) {
      throw new NotFoundException('CommandeClient not found !!');
    }
    
    const ligneCommandeClients = await this.ligneCommandeClientRepository.find({ where: { commandeClient: { id: id } } });
    if (ligneCommandeClients.length > 0) {
      throw new BadRequestException('Impossible de supprimer une commande client déjà utilisée');
    }
    
    await this.commandeClientRepository.remove(commandeClient);
    return true;
  }

  async updateMvmntStck(idCommande: number): Promise<void> {
    const commandeClient = await this.findById(idCommande);
    const ligneCommandeClients = await this.ligneCommandeClientRepository.find({
      where: { commandeClient: commandeClient },
    });

    ligneCommandeClients.forEach(async (ligne) => {
      const stockDto: StockDto = {
        article: ligne.article,
        dateMvmnt: new Date(),
        typeMvmntStck: TypedeMvmntStock.SORTIE,
        sourceMvmntStck: SourceMvmntStock.COMMANDE_CLIENT,
        quantite: ligne.quantite,
      };

      await this.stockService.sortieStock(stockDto);
    });
  }

  async generateUniqueCodeCC(nom: string, prenom: string): Promise<string> {
    let uniqueCode = '';
    let isUnique = false;
    while (!isUnique) {
      const code = `C-${nom[0].toUpperCase()}${prenom[0].toUpperCase()}${this.generateRandomString()}`;
      const existingCommande = await this.commandeClientRepository.findOne({ where: { codeCC: code } });
      if (!existingCommande) {
        uniqueCode = code;
        isUnique = true;
      }
    }
    return uniqueCode;
  }

  private generateRandomString(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomString += chars[randomIndex];
    }
    
    if (!/\d/.test(randomString)) {
      const randomDigit = Math.floor(Math.random() * 10);
      const replaceIndex = Math.floor(Math.random() * randomString.length);
      randomString = randomString.substring(0, replaceIndex) + randomDigit + randomString.substring(replaceIndex + 1);
    }

    return randomString;
  }

  private async updateStock(cmd: CommandeClientEntity) {
    for (const ligneCommandeClient of cmd.ligneCommandeClients) {
      const stockDto = new StockDto();

      stockDto.dateMvmnt = new Date();
      stockDto.quantite = ligneCommandeClient.quantite;
      stockDto.article = ligneCommandeClient.article;
      stockDto.typeMvmntStck = TypedeMvmntStock.SORTIE;
      stockDto.sourceMvmntStck = SourceMvmntStock.COMMANDE_CLIENT;

      await this.stockService.sortieStock(stockDto);
    }
  }

  async findAllCommandesByClientId(clientId: number): Promise<CommandeClientEntity[]> {
    /*const client = this.clientService.findOne(clientId);
    const cliantDto = plainToClass(ClientDto, client);*/
    return await this.commandeClientRepository.find({
      where: { client: { id: clientId } },
      relations: ['ligneCommandeClients', 'client'],
    });
  }

  async updateCommandeClient(commandeClientDto: CommandeClientDto): Promise<CommandeClientEntity> {
    const commande = await this.commandeClientRepository.findOne({ where: { id: commandeClientDto.id }, relations: ['ligneCommandeClients', 'client'] });
    const oldCmd = commande;
    if (!commande) {
      throw new NotFoundException(`CommandeClient with ID ${commandeClientDto.id} not found`);
    }

    if (commande.etatCommande === EtatCommande.LIVREE) {
      throw new BadRequestException("Cette commande est déjà livrée");
    }
  
    commande.etatCommande = commandeClientDto.etatCommande || commande.etatCommande;
    commande.dateCommande = commandeClientDto.dateCommande || commande.dateCommande;
  
    const lignesCmd = commandeClientDto.ligneCommandeClients;
    for (const ligneDto of lignesCmd) {
      let ligne = commande.ligneCommandeClients.find(l => l.id === ligneDto.id);
      if (ligne) {
        await this.updateQuantiteEtArticle(ligne, ligneDto.quantite, ligneDto.article.id);
      } else {
        ligne = this.ligneCommandeClientRepository.create(ligneDto);
        ligne.commandeClient = commande;
        await this.ligneCommandeClientRepository.save(ligne);
        await this.ajusterStockArticle(ligne.article.id, ligne.quantite, TypedeMvmntStock.CORRECTION_NEG);
      }
    }
  
    // Supprimer les lignes de commande qui ne sont plus présentes dans commandeClientDto
    const idsDto = lignesCmd.map(l => l.id);
    for (const ligne of commande.ligneCommandeClients) {
      if (!idsDto.includes(ligne.id)) {
        await this.ajusterStockArticle(ligne.article.id, ligne.quantite, TypedeMvmntStock.CORRECTION_POS);
        await this.ligneCommandeClientRepository.remove(ligne);
      }
    }

    const updatedCommande = Object.assign(oldCmd, commande);

    if(updatedCommande.etatCommande === EtatCommande.VALIDEE){
      this.notifyClientForCommandeValidation(updatedCommande.client.email, updatedCommande);
    }
  
    return await this.commandeClientRepository.save(updatedCommande);
  }
  
  private async updateQuantiteEtArticle(ligne: LigneCommandeClientEntity, nouvelleQuantite: number, nouvelArticleId: number) {
    const ancienArticleId = ligne.article.id;
    const quantiteChange = nouvelleQuantite - ligne.quantite;
  
    // Si l'article change, ajuster le stock de l'ancien et du nouvel article
    if (nouvelArticleId !== ancienArticleId) {
      // Augmenter le stock de l'ancien article
      await this.ajusterStockArticle(ancienArticleId, ligne.quantite, TypedeMvmntStock.CORRECTION_POS);
      // Diminuer le stock du nouvel article
      await this.ajusterStockArticle(nouvelArticleId, nouvelleQuantite, TypedeMvmntStock.CORRECTION_NEG);
  
      // Mettre à jour l'article de la ligne de commande
      const nouvelArticle = await this.articleService.findOne(nouvelArticleId);
      if (!nouvelArticle) {
        throw new NotFoundException(`Article with ID ${nouvelArticleId} not found`);
      }
      ligne.article = nouvelArticle;
    } else if (quantiteChange !== 0) {
      // Si la quantité change mais pas l'article, ajuster le stock en conséquence
      await this.ajusterStockArticle(nouvelArticleId, quantiteChange, quantiteChange > 0 ? TypedeMvmntStock.CORRECTION_NEG : TypedeMvmntStock.CORRECTION_POS);
    }
  
    // Mettre à jour la quantité de la ligne de commande
    ligne.quantite = nouvelleQuantite;
    await this.ligneCommandeClientRepository.save(ligne);
  }
  
  private async ajusterStockArticle(articleId: number, quantite: number, typeMouvement: TypedeMvmntStock) {
    // Trouver l'article concerné
    const article = await this.articleService.findOne(articleId);
    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }
  
    // Créer un nouveau mouvement de stock
    const mvmntStock = new StockEntity();
    mvmntStock.article = article;
    mvmntStock.dateMvmnt = new Date();
    mvmntStock.quantite = Math.abs(quantite);
    mvmntStock.typeMvmntStck = typeMouvement;
    mvmntStock.sourceMvmntStck = SourceMvmntStock.COMMANDE_CLIENT;

    if(typeMouvement === TypedeMvmntStock.CORRECTION_POS){
      await this.stockService.correctionStockPos(mvmntStock);
    }else if(typeMouvement === TypedeMvmntStock.CORRECTION_NEG){
      await this.stockService.correctionStockNeg(mvmntStock);
    }
    
  }
  
}

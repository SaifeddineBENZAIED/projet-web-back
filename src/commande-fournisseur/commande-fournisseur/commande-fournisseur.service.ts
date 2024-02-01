/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CommandeFournisseurEntity } from '../commande-fournisseur-entity/commande-fournisseur-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LigneCommandeFournisseurEntity } from 'src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';
import { StockService } from 'src/stock/stock/stock.service';
import { FournisseurService } from 'src/fournisseur/fournisseur/fournisseur.service';
import { CommandeFournisseurDto } from '../commande-fournisseur-dto/commande-fournisseur-dto';
import { EtatCommande } from 'src/etat-commande';
import { StockDto } from 'src/stock/stock-dto/stock-dto';
import { TypedeMvmntStock } from 'src/type-mvmnt-stock';
import { SourceMvmntStock } from 'src/source-mvmnt-stock';
import { ArticleService } from 'src/article/article/article.service';
import { StockEntity } from 'src/stock/stock-entity/stock-entity';

@Injectable()
export class CommandeFournisseurService {
    constructor(
        @InjectRepository(CommandeFournisseurEntity)
        private readonly commandeFournisseurRepository: Repository<CommandeFournisseurEntity>,
        @InjectRepository(LigneCommandeFournisseurEntity)
        private readonly ligneCommandeFournisseurRepository: Repository<LigneCommandeFournisseurEntity>,
        private readonly articleService: ArticleService,
        private readonly stockService: StockService,
        private readonly fournisseurService: FournisseurService,
    ) {}
    
    async save(commandeFournisseurDto: CommandeFournisseurDto): Promise<CommandeFournisseurEntity> {
        const fournisseur = await this.fournisseurService.findOne(commandeFournisseurDto.fournisseur.id);
        if (!fournisseur) {
            throw new NotFoundException(`Fournisseur with ID ${commandeFournisseurDto.fournisseur.id} not found`);
        }

        const commandeFournisseur = this.commandeFournisseurRepository.create(commandeFournisseurDto);
        const savedCF = await this.commandeFournisseurRepository.save(commandeFournisseur);
        
        this.updateStock(savedCF);

        return savedCF;
    }
    
      async updateEtatCommande(
        idCommande: number,
        etatCommande: EtatCommande,
      ): Promise<CommandeFournisseurEntity> {
        if (!idCommande) {
            throw new BadRequestException("Invalid ID");
        }
      
        if (!etatCommande) {
          throw new BadRequestException("EtatCommande is null");
        }
      
        const commandeFournisseur = await this.findById(idCommande);
        if (!commandeFournisseur) {
          throw new NotFoundException(`CommandeFournisseur with ID ${idCommande} not found`);
        }
      
        if (commandeFournisseur.etatCommande === EtatCommande.LIVREE) {
          throw new BadRequestException("Cette commande est déjà livrée");
        }
      
        commandeFournisseur.etatCommande = etatCommande;
        await this.commandeFournisseurRepository.save(commandeFournisseur);
      
        if (commandeFournisseur.etatCommande === EtatCommande.LIVREE) {
          await this.updateMvmntStck(idCommande);
        }
    
        return commandeFournisseur;
      }
    
      async updateQuantiteCommande(
        idCommande: number,
        idLigneCommande: number,
        quantite: number,
      ): Promise<CommandeFournisseurEntity> {
        if (!idCommande) {
          throw new BadRequestException("Invalid Commande ID");
        }
        if (!idLigneCommande) {
          throw new BadRequestException("Invalid Ligne Commande ID");
        }
        if (quantite <= 0) {
          throw new BadRequestException("Quantite must be greater than zero");
        }
        
        const commandeFournisseur = await this.commandeFournisseurRepository.findOne({ where: { id: idCommande } });
        if (!commandeFournisseur) {
          throw new NotFoundException(`CommandeFournisseur with ID ${idCommande} not found`);
        }
        
        if (commandeFournisseur.etatCommande === EtatCommande.LIVREE) {
          throw new BadRequestException("Cette commande est déjà livrée");
        }
        
        const ligneCommandeFournisseur = await this.ligneCommandeFournisseurRepository.findOne({ where: { id: idLigneCommande } });
        if (!ligneCommandeFournisseur) {
          throw new NotFoundException(`LigneCommandeFournisseur with ID ${idLigneCommande} not found`);
        }
        
        ligneCommandeFournisseur.quantite = quantite;
        await this.ligneCommandeFournisseurRepository.save(ligneCommandeFournisseur);
    
        return commandeFournisseur;
      }
    
      async updateFournisseur(
        idCommande: number,
        idFournisseur: number,
      ): Promise<CommandeFournisseurEntity> {
        if (!idCommande) {
          throw new BadRequestException("Invalid Commande ID");
        }
        if (!idFournisseur) {
          throw new BadRequestException("Invalid Fournisseur ID");
        }
        
        const commandeFournisseur = await this.commandeFournisseurRepository.findOne({ where: { id: idCommande } });
        if (!commandeFournisseur) {
          throw new NotFoundException(`CommandeFournisseur with ID ${idCommande} not found`);
        }
        
        if (commandeFournisseur.etatCommande === EtatCommande.LIVREE) {
          throw new BadRequestException("Cette commande est déjà livrée");
        }
        
        const fournisseur = await this.fournisseurService.findOne(idFournisseur);
        if (!fournisseur) {
          throw new NotFoundException(`Fournisseur with ID ${idFournisseur} not found`);
        }
        
        commandeFournisseur.fournisseur = fournisseur;
        await this.commandeFournisseurRepository.save(commandeFournisseur);
        
        return commandeFournisseur;
      }
    
      async updateArticle(
        idCommande: number,
        idLigneCommande: number,
        newIdArticle: number,
      ): Promise<CommandeFournisseurEntity> {
        if (!idCommande) {
          throw new BadRequestException("Invalid Commande ID");
        }
        if (!idLigneCommande) {
          throw new BadRequestException("Invalid Ligne Commande ID");
        }
        if (!newIdArticle) {
          throw new BadRequestException("Invalid Article ID");
        }
        
        const commandeFournisseur = await this.commandeFournisseurRepository.findOne({ where: { id: idCommande } });
        if (!commandeFournisseur) {
          throw new NotFoundException(`CommandeFournisseur with ID ${idCommande} not found`);
        }
        
        if (commandeFournisseur.etatCommande === EtatCommande.LIVREE) {
          throw new BadRequestException("Cette commande est déjà livrée");
        }
        
        const ligneCommandeFournisseur = await this.ligneCommandeFournisseurRepository.findOne({ where: { id: idLigneCommande } });
        if (!ligneCommandeFournisseur) {
          throw new NotFoundException(`LigneCommandeFournisseur with ID ${idLigneCommande} not found`);
        }
        
        const article = await this.articleService.findOne(newIdArticle);
        if (!article) {
          throw new NotFoundException(`Article with ID ${newIdArticle} not found`);
        }
            
        ligneCommandeFournisseur.article = article;
        await this.ligneCommandeFournisseurRepository.save(ligneCommandeFournisseur);
        
        return commandeFournisseur;
      }
    
      async deleteArticle(
        idCommande: number,
        idLigneCommande: number,
      ): Promise<CommandeFournisseurEntity> {
        if (!idCommande) {
          throw new BadRequestException("Invalid Commande ID");
        }
        if (!idLigneCommande) {
          throw new BadRequestException("Invalid Ligne Commande ID");
        }
        
        const commandeFournisseur = await this.commandeFournisseurRepository.findOne({ where: { id: idCommande } });
        if (!commandeFournisseur) {
          throw new NotFoundException(`CommandeFournisseur with ID ${idCommande} not found`);
        }
        
        if (commandeFournisseur.etatCommande === EtatCommande.LIVREE) {
          throw new BadRequestException("Cette commande est déjà livrée");
        }
        
        const ligneCommandeFournisseur = await this.ligneCommandeFournisseurRepository.findOne({ where: { id: idLigneCommande } });
        if (!ligneCommandeFournisseur) {
          throw new NotFoundException(`LigneCommandeFournisseur with ID ${idLigneCommande} not found`);
        }
        
        await this.ligneCommandeFournisseurRepository.remove(ligneCommandeFournisseur);
        
        return commandeFournisseur;
      }
    
      async findById(id: number): Promise<CommandeFournisseurEntity> {
        if (!id) {
            throw new BadRequestException('Invalid ID');
        }
      
        const commandeFournisseur = await this.commandeFournisseurRepository.findOne({ where: { id: id }, relations: ['fournisseur', 'ligneCommandeFournisseurs'], });
        if (!commandeFournisseur) {
          throw new NotFoundException(`CommandeFournisseur with ID ${id} not found`);
        }
    
        return commandeFournisseur;
      }
    
      async findByCodeCF(codeCF: string): Promise<CommandeFournisseurEntity> {
        if (!codeCF) {
            throw new BadRequestException('Invalid code commande');
        }
      
        const commandeFournisseur = await this.commandeFournisseurRepository.findOne({ where: { codeCF: codeCF }, relations: ['fournisseur', 'ligneCommandeFournisseurs'], });
        if (!commandeFournisseur) {
          throw new NotFoundException(`CommandeFournisseur with code ${codeCF} not found`);
        }
    
        return commandeFournisseur;
      }
    
      async findAll(): Promise<CommandeFournisseurEntity[]> {
        const commandeFournisseurs = await this.commandeFournisseurRepository.find({
          relations: ['fournisseur', 'ligneCommandeFournisseurs'],
        });
        return commandeFournisseurs;
      }
    
      async findAllLigneCommandeFournisseursByCommandeFournisseurId(
        idCommande: number,
      ): Promise<LigneCommandeFournisseurEntity[]> {
        if (!idCommande) {
          throw new BadRequestException("Invalid Commande ID");
        }
        
        const ligneCommandeFournisseurs = await this.ligneCommandeFournisseurRepository.find({
          where: { commandeFournisseur: { id: idCommande } },
          relations: ['commandeFournisseur', 'article'],
        });
        
        return ligneCommandeFournisseurs;
      }
    
      async delete(id: number): Promise<boolean> {
        if (!id) {
          throw new BadRequestException('Invalid ID');
        }
        
        const commandeFournisseur = await this.commandeFournisseurRepository.findOne({ where: { id: id } });
        if (!commandeFournisseur) {
          throw new NotFoundException('CommandeFournisseur not found !!');
        }
        
        const ligneCommandeFournisseurs = await this.ligneCommandeFournisseurRepository.find({ where: { commandeFournisseur: { id: id } } });
        if (ligneCommandeFournisseurs.length > 0) {
          throw new BadRequestException('Impossible de supprimer une commande fournisseur déjà utilisée');
        }
        
        await this.commandeFournisseurRepository.remove(commandeFournisseur);
        return true;
      }
    
      async updateMvmntStck(idCommande: number): Promise<void> {
        const commandeFournisseur = await this.findById(idCommande);
        const ligneCommandeFournisseurs = await this.ligneCommandeFournisseurRepository.find({
          where: { commandeFournisseur: commandeFournisseur },
        });
    
        ligneCommandeFournisseurs.forEach(async (ligne) => {
          const stockDto: StockDto = {
            article: ligne.article,
            dateMvmnt: new Date(),
            typeMvmntStck: TypedeMvmntStock.ENTREE,
            sourceMvmntStck: SourceMvmntStock.COMMANDE_FOURNISSEUR,
            quantite: ligne.quantite,
          };
    
          await this.stockService.entreeStock(stockDto);
        });
      }

      async generateUniqueCodeCF(nom: string, prenom: string): Promise<string> {
        let uniqueCode = '';
        let isUnique = false;
        while (!isUnique) {
          const code = `F-${nom[0].toUpperCase()}${prenom[0].toUpperCase()}${this.generateRandomString()}`;
          const existingCommande = await this.commandeFournisseurRepository.findOne({ where: { codeCF: code } });
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

      private async updateStock(cmd: CommandeFournisseurEntity) {
        for (const ligneCommandeFournisseur of cmd.ligneCommandeFournisseurs) {
          const stockDto = new StockDto();

          stockDto.dateMvmnt = new Date();
          stockDto.quantite = ligneCommandeFournisseur.quantite;
          stockDto.article = ligneCommandeFournisseur.article;
          stockDto.typeMvmntStck = TypedeMvmntStock.ENTREE;
          stockDto.sourceMvmntStck = SourceMvmntStock.COMMANDE_FOURNISSEUR;

          await this.stockService.entreeStock(stockDto);
        }
      }

      async findAllCommandesByFournisseurId(fournisseurId: number): Promise<CommandeFournisseurEntity[]> {
        /*const fournisseur = this.fournisseurService.findOne(fournisseurId);
        const fournisseurDto = plainToClass(FournisseurDto, fournisseur);*/
        return await this.commandeFournisseurRepository.find({
          where: { fournisseur: { id: fournisseurId } },
          relations: ['ligneCommandeFournisseurs', 'fournisseur'],
        });
      }

      async updateCommandeFournisseur(commandeFournisseurDto: CommandeFournisseurDto): Promise<CommandeFournisseurEntity> {
        const commande = await this.commandeFournisseurRepository.findOne({ where: { id: commandeFournisseurDto.id }, relations: ['ligneCommandeFournisseurs', 'Fournisseur'] });
        const oldCmd = commande;
        if (!commande) {
          throw new NotFoundException(`CommandeFournisseur with ID ${commandeFournisseurDto.id} not found`);
        }
      
        commande.etatCommande = commandeFournisseurDto.etatCommande || commande.etatCommande;
        commande.dateCommande = commandeFournisseurDto.dateCommande || commande.dateCommande;
        const lignesCmd = await this.findAllLigneCommandeFournisseursByCommandeFournisseurId(commandeFournisseurDto.id);
        for (const ligneDto of lignesCmd) {
          let ligne = commande.ligneCommandeFournisseurs.find(l => l.id === ligneDto.id);
          if (ligne) {
            await this.updateQuantiteEtArticle(ligne, ligneDto.quantite, ligneDto.article.id);
          } else {
            ligne = this.ligneCommandeFournisseurRepository.create(ligneDto);
            ligne.commandeFournisseur = commande;
            await this.ligneCommandeFournisseurRepository.save(ligne);
            await this.ajusterStockArticle(ligne.article.id, ligne.quantite, TypedeMvmntStock.CORRECTION_POS);
          }
        }
      
        const idsDto = lignesCmd.map(l => l.id);
        commande.ligneCommandeFournisseurs.forEach(async ligne => {
          if (!idsDto.includes(ligne.id)) {
            await this.ajusterStockArticle(ligne.article.id, ligne.quantite, TypedeMvmntStock.CORRECTION_NEG);
            await this.ligneCommandeFournisseurRepository.remove(ligne);
          }
        });

        const updatedCommande = Object.assign(oldCmd, commande);
        
        return await this.commandeFournisseurRepository.save(updatedCommande);
      }
      
      private async updateQuantiteEtArticle(ligne: LigneCommandeFournisseurEntity, nouvelleQuantite: number, nouvelArticleId: number) {
        const ancienArticleId = ligne.article.id;
        const quantiteChange = nouvelleQuantite - ligne.quantite;
      
        // Si l'article change, ajuster le stock de l'ancien et du nouvel article
        if (nouvelArticleId !== ancienArticleId) {
          // Diminuer le stock de l'ancien article
          await this.ajusterStockArticle(ancienArticleId, ligne.quantite, TypedeMvmntStock.CORRECTION_NEG);
          // Augmenter le stock du nouvel article
          await this.ajusterStockArticle(nouvelArticleId, nouvelleQuantite, TypedeMvmntStock.CORRECTION_POS);
      
          // Mettre à jour l'article de la ligne de commande
          const nouvelArticle = await this.articleService.findOne(nouvelArticleId);
          if (!nouvelArticle) {
            throw new NotFoundException(`Article with ID ${nouvelArticleId} not found`);
          }
          ligne.article = nouvelArticle;
        } else if (quantiteChange !== 0) {
          // Si la quantité change mais pas l'article, ajuster le stock en conséquence
          await this.ajusterStockArticle(nouvelArticleId, quantiteChange, quantiteChange > 0 ? TypedeMvmntStock.CORRECTION_POS : TypedeMvmntStock.CORRECTION_NEG);
        }
      
        // Mettre à jour la quantité de la ligne de commande
        ligne.quantite = nouvelleQuantite;
        await this.ligneCommandeFournisseurRepository.save(ligne);
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
        mvmntStock.sourceMvmntStck = SourceMvmntStock.COMMANDE_FOURNISSEUR;
      
        await this.stockService.save(mvmntStock);
      }
}

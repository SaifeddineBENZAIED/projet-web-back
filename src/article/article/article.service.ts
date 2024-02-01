/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ArticleEntity } from '../article-entity/article-entity';
import { ArticleDto } from '../article-dto/article-dto';
import { LigneCommandeClientEntity } from 'src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity';
import { LigneCommandeFournisseurEntity } from 'src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';
import { TypeArticle } from 'src/type-article';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleRepository: Repository<ArticleEntity>,
        @InjectRepository(LigneCommandeClientEntity)
        private readonly ligneCommandeClientRepository: Repository<LigneCommandeClientEntity>,
        @InjectRepository(LigneCommandeFournisseurEntity)
        private readonly ligneCommandeFournisseurRepository: Repository<LigneCommandeFournisseurEntity>,
    ) {}

    async create(createArticleDto: ArticleDto): Promise<ArticleEntity> {
      createArticleDto.nomArticle = createArticleDto.nomArticle.toLowerCase();
      const article = this.articleRepository.create(createArticleDto);
      //article.prixUnitaireTTC = article.prixUnitaireHT * article.tauxTVA;
      return await this.articleRepository.save(article);
    }

    async findOne(id: number): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOne({ where: { id: id } });
        if (!article) {
          throw new NotFoundException(`Article with ID ${id} not found`);
        }
        return article;
    }
    
    async findAll(): Promise<ArticleEntity[]> {
      return await this.articleRepository.find();
    }

    async findByNomArticle(nomArticle: string): Promise<ArticleEntity> {
        if (!nomArticle) {
          throw new NotFoundException('Le nom d\'article est invalide');
        }
    
        const article = await this.articleRepository.findOne({
          where: { nomArticle: nomArticle.toLowerCase() },
        });
    
        if (!article) {
          throw new NotFoundException(`Aucun article avec le nom = ${nomArticle} n'est trouvé dans la BD`);
        }
    
        return article;
    }

    async findAllByNomArticle(nomArticle: string): Promise<ArticleEntity[]> {
      if (!nomArticle) {
          throw new NotFoundException("Le nom d'article est invalide");
      }
  
      const articles = await this.articleRepository.find({
          where: { nomArticle: Like(`%${nomArticle.toLowerCase()}%`) },
      });
  
      if (!articles || articles.length === 0) {
          throw new NotFoundException(`Aucun article contenant le nom "${nomArticle}" n'a été trouvé dans la base de données`);
      }
  
      return articles;
    }

    async findByCodeArticle(codeArticle: string): Promise<ArticleEntity> {
        if (!codeArticle) {
          throw new NotFoundException('Le code d\'article est invalide');
        }
    
        const article = await this.articleRepository.findOne({
          where: { codeArticle: codeArticle },
        });
    
        if (!article) {
          throw new NotFoundException(`Aucun article avec le nom = ${codeArticle} n'est trouvé dans la BD`);
        }
    
        return article;
    }

    findAllByType(typeArticle: TypeArticle): Promise<ArticleEntity[]> {
      return this.articleRepository.find({ where: { type: typeArticle } });
    }

    async findAllByNomArticleAndType(nomArticle: string, typeArticle: TypeArticle): Promise<ArticleEntity[]> {
      if (!nomArticle) {
          throw new NotFoundException("Le nom d'article est invalide");
      }
  
      const articles = await this.articleRepository.find({
          where: {
              nomArticle: Like(`%${nomArticle.toLowerCase()}%`),
              type: typeArticle
          }
      });
  
      if (!articles || articles.length === 0) {
          throw new NotFoundException(`Aucun article contenant le nom "${nomArticle}" et de type "${typeArticle}" n'a été trouvé dans la base de données`);
      }
  
      return articles;
    }

    async findHistoriqueCommandeClient(idArticle: number): Promise<LigneCommandeClientEntity[]> {
        const historique = await this.ligneCommandeClientRepository.find({
          where: { article: { id: idArticle } },
        });
    
        if (!historique) {
          throw new NotFoundException('Aucun historique de commande client trouvé pour cet article');
        }
    
        return historique;
    }
    
    async findHistoriqueCommandeFournisseur(idArticle: number): Promise<LigneCommandeFournisseurEntity[]> {
        const historique = await this.ligneCommandeFournisseurRepository.find({
          where: { article: { id: idArticle } },
        });
    
        if (!historique) {
          throw new NotFoundException('Aucun historique de commande fournisseur trouvé pour cet article');
        }
    
        return historique;
    }

    async delete(id: number): Promise<boolean> {
        if (!id) {
          throw new NotFoundException("L'ID d'article est non valide");
        }
    
        const article = await this.findOne(id);
    
        if (!article) {
          throw new NotFoundException('Article not found !!');
        }
    
        const ligneCommandeClients = await this.findHistoriqueCommandeClient(id);
        if (ligneCommandeClients.length > 0) {
          throw new BadRequestException("Impossible de supprimer un article déjà utilisé dans une commande client");
        }
    
        const ligneCommandeFournisseurs = await this.findHistoriqueCommandeFournisseur(id);
        if (ligneCommandeFournisseurs.length > 0) {
          throw new BadRequestException("Impossible de supprimer un article déjà utilisé dans une commande fournisseur");
        }
    
        await this.articleRepository.delete(id);
        return true;
    }

    async findMostSoldArticles(startDate?: Date, endDate?: Date): Promise<ArticleEntity[]> {
      const queryBuilder = this.articleRepository
          .createQueryBuilder('article')
          .leftJoin('article.ligneCommandeClients', 'ligneCommandeClient')
          .select('article.id', 'id')
          .addSelect('article.nomArticle', 'nomArticle')
          .addSelect('article.codeArticle', 'codeArticle')
          .addSelect('SUM(ligneCommandeClient.quantite)', 'totalVendu')
          .groupBy('article.id')
          .orderBy('totalVendu', 'DESC')
          .take(10);
  
      if (startDate && endDate) {
          queryBuilder
              .where('ligneCommandeClient.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }
  
      return queryBuilder.getRawMany();
    }

    async findMostPurchasedArticles(startDate?: Date, endDate?: Date): Promise<ArticleEntity[]> {
      const queryBuilder = this.articleRepository
          .createQueryBuilder('article')
          .leftJoin('article.ligneCommandeFournisseurs', 'ligneCommandeFournisseur')
          .select('article.id', 'id')
          .addSelect('article.nomArticle', 'nomArticle')
          .addSelect('article.codeArticle', 'codeArticle')
          .addSelect('SUM(ligneCommandeFournisseur.quantite)', 'totalAchete')
          .groupBy('article.id')
          .orderBy('totalAchete', 'DESC')
          .take(10);
  
      if (startDate && endDate) {
          queryBuilder
              .where('ligneCommandeFournisseur.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }
  
      return queryBuilder.getRawMany();
    }
  
}

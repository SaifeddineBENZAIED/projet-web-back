/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { LigneCommandeClientEntity } from 'src/ligne-commande-client/ligne-commande-client-entity/ligne-commande-client-entity';
import { LigneCommandeFournisseurEntity } from 'src/ligne-commande-fournisseur/ligne-commande-fournisseur-entity/ligne-commande-fournisseur-entity';
import { ArticleDto } from '../article-dto/article-dto';
import { ArticleEntity } from '../article-entity/article-entity';
import { ArticleService } from './article.service';
import { TypeArticle } from 'src/type-article';

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post('/create')
    async create(@Body() createArticleDto: ArticleDto): Promise<ArticleEntity> {
        return await this.articleService.create(createArticleDto);
    }

    @Get('/find/all')
    async findAll(): Promise<ArticleEntity[]> {
        return await this.articleService.findAll();
    }

    @Get('/find/:id')
    async findOne(@Param('id') id: number): Promise<ArticleEntity> {
        return await this.articleService.findOne(id);
    }

    @Get('/find/byName/:nomArticle')
    async findByNomArticle(@Param('nomArticle') nomArticle: string): Promise<ArticleEntity> {
        return await this.articleService.findByNomArticle(nomArticle);
    }

    @Get('/find/allByName/:nomArticle')
    async findAllByNomArticle(@Param('nomArticle') nomArticle: string): Promise<ArticleEntity[]> {
        return await this.articleService.findAllByNomArticle(nomArticle);
    }

    @Get('/find/byCode/:codeArticle')
    async findByCodeArticle(@Param('codeArticle') codeArticle: string): Promise<ArticleEntity> {
        return await this.articleService.findByCodeArticle(codeArticle);
    }

    @Get('/find/byType/:typeArticle')
    async findByTypeArticle(@Param('typeArticle') typeArticle: TypeArticle): Promise<ArticleEntity[]> {
        return await this.articleService.findAllByType(typeArticle);
    }

    @Get('/find/allByNameAndType/:nomArticle/:typeArticle')
    async findAllByNomArticleAndType(@Param('nomArticle') nomArticle: string, @Param('typeArticle') typeArticle: TypeArticle): Promise<ArticleEntity[]> {
        return await this.articleService.findAllByNomArticleAndType(nomArticle, typeArticle);
    }

    @Get('/historiqueCommandeClient/:id')
    async findHistoriqueCommandeClient(@Param('id') id: number): Promise<LigneCommandeClientEntity[]> {
        return await this.articleService.findHistoriqueCommandeClient(id);
    }

    @Get('/historiqueCommandeFournisseur/:id')
    async findHistoriqueCommandeFournisseur(@Param('id') id: number): Promise<LigneCommandeFournisseurEntity[]> {
        return await this.articleService.findHistoriqueCommandeFournisseur(id);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: string): Promise<boolean> {
        return await this.articleService.delete(Number(id));
    }

    @Get('/plus-vendus')
    findMostSoldArticles(
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date
    ) {
        return this.articleService.findMostSoldArticles(startDate, endDate);
    }

    @Get('plus-achetes')
    findMostPurchasedArticles(
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date
    ) {
        return this.articleService.findMostPurchasedArticles(startDate, endDate);
    }
}

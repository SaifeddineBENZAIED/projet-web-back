/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { StockDto } from '../stock-dto/stock-dto';
import { StockEntity } from '../stock-entity/stock-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypedeMvmntStock } from 'src/type-mvmnt-stock';
import { ArticleService } from 'src/article/article/article.service';
import { SourceMvmntStock } from 'src/source-mvmnt-stock';
import { UserService } from 'src/user/user/user.service';
import { MailService } from 'src/mailing/mail/mail.service';
import { ArticleEntity } from 'src/article/article-entity/article-entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async save(stockDto: StockDto): Promise<StockEntity> {
    const stock = this.stockRepository.create(stockDto);
    const savedStock = await this.stockRepository.save(stock);
    this.checkAndNotify(savedStock.article);
    return savedStock;
  }

  async correctionStockNeg(stockDto: StockDto): Promise<StockEntity> {
    stockDto.quantite = Math.abs(stockDto.quantite);
    stockDto.typeMvmntStck = TypedeMvmntStock.CORRECTION_NEG;
    stockDto.sourceMvmntStck = SourceMvmntStock.CORRECTION;

    this.checkAndNotify(stockDto.article);

    return await this.save(stockDto);
  }

  async correctionStockPos(stockDto: StockDto): Promise<StockEntity> {
    stockDto.quantite = Math.abs(stockDto.quantite);
    stockDto.typeMvmntStck = TypedeMvmntStock.CORRECTION_POS;
    stockDto.sourceMvmntStck = SourceMvmntStock.CORRECTION;

    this.checkAndNotify(stockDto.article);

    return await this.save(stockDto);
  }

  async sortieStock(stockDto: StockDto): Promise<StockEntity> {
    stockDto.quantite = -Math.abs(stockDto.quantite);
    stockDto.typeMvmntStck = TypedeMvmntStock.SORTIE;

    this.checkAndNotify(stockDto.article);

    return await this.save(stockDto);
  }

  async entreeStock(stockDto: StockDto): Promise<StockEntity> {
    stockDto.quantite = Math.abs(stockDto.quantite);
    stockDto.typeMvmntStck = TypedeMvmntStock.ENTREE;

    this.checkAndNotify(stockDto.article);

    return await this.save(stockDto);
  }

  async mvmntStckArticle(idArticle: number): Promise<StockEntity[]> {
    const article = await this.articleService.findOne(idArticle);
    if(!article){
        throw new NotFoundException(
            `Aucun article n'a été trouvé avec l'ID ${idArticle}`,
        );
    }
    /*const mvmntsStock = await this.stockRepository.find({
        where: { article: article },
        relations: ['article'],
    });*/
    const mvmntsStock = await this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.article', 'article')
      .where('article.id = :idArticle', { idArticle })
      .getMany();
    
    return mvmntsStock;
  }

  async stockReelArticle(idArticle: number): Promise<number> {
    const result = await this.stockRepository
      .createQueryBuilder('m')
      .select(`
        SUM(CASE WHEN typeMvmntStck IN ('ENTREE', 'CORRECTION_POS') THEN ABS(m.quantite) ELSE 0 END)
        - SUM(CASE WHEN typeMvmntStck IN ('SORTIE', 'CORRECTION_NEG') THEN ABS(m.quantite) ELSE 0 END)`,
        'realStock')
      .where('m.articleId = :idArticle', { idArticle })
      .getRawOne();

    if (!result || result.realStock === null) {
      throw new NotFoundException(`Stock not found for article with ID ${idArticle}`);
    }

    const realStock = parseFloat(result.realStock);

    return realStock;
  }

  async checkAndNotify(article: ArticleEntity) {
    const stckR = await this.stockReelArticle(article.id);
    if(stckR < 5){
      const listUser = await this.userService.findAll();

      const htmlContent = `<p>Le stock de l'article ${article.nomArticle} est faible.</p>`;
      
      for (const user of listUser) {
        await this.mailService.sendMail(user.email, 'Stock faible', htmlContent);
      }
    }
  }
}

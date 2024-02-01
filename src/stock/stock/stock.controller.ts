/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StockDto } from '../stock-dto/stock-dto';
import { StockEntity } from '../stock-entity/stock-entity';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) {}

    @Post('/create')
    async createStock(@Body() stockDto: StockDto): Promise<StockEntity> {
        return await this.stockService.save(stockDto);
    }

    @Patch('/correction-neg')
    async correctionStockNeg(@Body() stockDto: StockDto): Promise<StockEntity> {
        return await this.stockService.correctionStockNeg(stockDto);
    }

    @Patch('/correction-pos')
    async correctionStockPos(@Body() stockDto: StockDto): Promise<StockEntity> {
        return await this.stockService.correctionStockPos(stockDto);
    }

    @Patch('/sortie')
    async sortieStock(@Body() stockDto: StockDto): Promise<StockEntity> {
        return await this.stockService.sortieStock(stockDto);
    }

    @Patch('/entree')
    async entreeStock(@Body() stockDto: StockDto): Promise<StockEntity> {
        return await this.stockService.entreeStock(stockDto);
    }

    @Get('/article/:idArticle')
    async getMvmntStckArticle(@Param('idArticle') idArticle: number): Promise<StockEntity[]> {
        return await this.stockService.mvmntStckArticle(idArticle);
    }

    @Get('/article/:idArticle/stock-reel')
    async getStockReelArticle(@Param('idArticle') idArticle: number): Promise<number> {
        return await this.stockService.stockReelArticle(idArticle);
    }
}

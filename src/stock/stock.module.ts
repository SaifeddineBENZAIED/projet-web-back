import { Module } from '@nestjs/common';
import { StockService } from './stock/stock.service';
import { StockController } from './stock/stock.controller';
import { StockEntity } from './stock-entity/stock-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from 'src/article/article.module';
import { UserModule } from 'src/user/user.module';
import { ClientModule } from 'src/client/client.module';
import { MailService } from 'src/mailing/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockEntity]),
    ArticleModule,
    UserModule,
    ClientModule,
  ],
  providers: [StockService, MailService],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { ArticleModule } from './article/article.module';
import { StockModule } from './stock/stock.module';
import { CommandeClientModule } from './commande-client/commande-client.module';
import { CommandeFournisseurModule } from './commande-fournisseur/commande-fournisseur.module';
import { LigneCommandeClientModule } from './ligne-commande-client/ligne-commande-client.module';
import { LigneCommandeFournisseurModule } from './ligne-commande-fournisseur/ligne-commande-fournisseur.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationController } from './authentication/authentication/authentication.controller';
import { FlickrModule } from './flickr/flickr.module';
import { FlickrService } from './flickr/flickr/flickr.service';
import { ImageController } from './image/image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StrategyImageContextService } from './strategy/strategy-image-context/strategy-image-context.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mailing/mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    /*JwtModule.register({
      secret:
        'Kl3Fxb2G9s4TzZ6R8f5sRmVrN3yKp2UqW8cYd8gF2a7e5tC7h2a0i9n3gT4h5i9s1i8s',
      signOptions: { expiresIn: '86400000s' },
    }),*/
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '',
      database: 'bd_projet_web_librairie',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    ClientModule,
    FournisseurModule,
    ArticleModule,
    StockModule,
    CommandeClientModule,
    CommandeFournisseurModule,
    LigneCommandeClientModule,
    LigneCommandeFournisseurModule,
    UserModule,
    TokenModule,
    AuthenticationModule,
    FlickrModule,
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [AppController, AuthenticationController, ImageController],
  providers: [
    AppService,
    JwtService,
    FlickrService,
    StrategyImageContextService,
    MailService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/auth/(.*)').forRoutes('*');
  }
}

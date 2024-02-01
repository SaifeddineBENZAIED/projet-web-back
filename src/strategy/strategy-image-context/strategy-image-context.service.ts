/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Strategy } from '../strategy';
import { SaveArticleImageService } from '../save-article-image/save-article-image.service';
import { SaveClientImageService } from '../save-client-image/save-client-image.service';
import { SaveUserImageService } from '../save-user-image/save-user-image.service';
import { SaveFournisseurImageService } from '../save-fournisseur-image/save-fournisseur-image.service';

@Injectable()
export class StrategyImageContextService {
  private strategy: Strategy<any>;

  constructor(
    private articleStrategy: SaveArticleImageService,
    private clientStrategy: SaveClientImageService,
    private userStrategy: SaveUserImageService,
    private fournisseurStrategy: SaveFournisseurImageService,
  ) {}

  async saveImage(
    context: string,
    id: number,
    image: Buffer,
    title: string,
  ): Promise<any> {
    this.determineContext(context);
    return await this.strategy.saveImage(id, image, title);
  }

  private determineContext(context: string) {
    switch (context) {
      case 'article':
        this.strategy = this.articleStrategy;
        break;
      case 'client':
        this.strategy = this.clientStrategy;
        break;
      case 'fournisseur':
        this.strategy = this.fournisseurStrategy;
        break;
      case 'user':
        this.strategy = this.userStrategy;
        break;
      default:
        throw new NotFoundException(
          `Unknown context for image saving: ${context}`,
        );
    }
  }
}

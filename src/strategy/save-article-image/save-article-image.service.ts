/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Strategy } from '../strategy';
import { ArticleDto } from 'src/article/article-dto/article-dto';
import { ArticleService } from 'src/article/article/article.service';
import { FlickrService } from 'src/flickr/flickr/flickr.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SaveArticleImageService implements Strategy<ArticleDto> {
  constructor(
    private readonly flickrService: FlickrService,
    private readonly articleService: ArticleService,
  ) {}

  async saveImage(
    id: number,
    image: Buffer,
    title: string,
  ): Promise<ArticleDto> {
    const article = await this.articleService.findOne(id);
    const articleDto = plainToClass(ArticleDto, article);
    if (!articleDto) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    try {
      const urlImage = await this.flickrService.uploadPhoto(image, title);
      if (!urlImage) {
        throw new BadRequestException('Error uploading image for article');
      }
      articleDto.image = urlImage;
      const savedArticle = await this.articleService.create(articleDto);
      return plainToClass(ArticleDto, savedArticle);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

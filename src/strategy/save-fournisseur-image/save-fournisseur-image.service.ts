/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Strategy } from '../strategy';
import { FournisseurDto } from 'src/fournisseur/fournisseur-dto/fournisseur-dto';
import { FlickrService } from 'src/flickr/flickr/flickr.service';
import { FournisseurService } from 'src/fournisseur/fournisseur/fournisseur.service';

@Injectable()
export class SaveFournisseurImageService implements Strategy<FournisseurDto> {
  constructor(
    private readonly flickrService: FlickrService,
    private readonly fournisseurService: FournisseurService,
  ) {}

  async saveImage(
    id: number,
    image: Buffer,
    title: string,
  ): Promise<FournisseurDto> {
    const fournisseurDto = await this.fournisseurService.findOne(id);
    if (!fournisseurDto) {
      throw new NotFoundException(`Fournisseur with ID ${id} not found`);
    }

    const urlImage = await this.flickrService.uploadPhoto(image, title);
    if (!urlImage) {
      throw new Error('Error saving fournisseur image');
    }

    fournisseurDto.image = urlImage;
    return this.fournisseurService.create(fournisseurDto);
  }
}

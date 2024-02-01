/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ClientDto } from 'src/client/client-dto/client-dto';
import { ClientService } from 'src/client/client/client.service';
import { FlickrService } from 'src/flickr/flickr/flickr.service';
import { Strategy } from '../strategy';

@Injectable()
export class SaveClientImageService implements Strategy<ClientDto>{
  constructor(
    private readonly flickrService: FlickrService,
    private readonly clientService: ClientService,
  ) {}

  async saveImage(
    id: number,
    image: Buffer,
    title: string,
  ): Promise<ClientDto> {
    const client = await this.clientService.findOne(id);
    const clientDto = plainToClass(ClientDto, client);
    if (!clientDto) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    const urlImage = await this.flickrService.uploadPhoto(image, title);
    if (!urlImage) {
      throw new Error('Error saving client image');
    }

    clientDto.image = urlImage;
    return this.clientService.create(clientDto);
  }
}

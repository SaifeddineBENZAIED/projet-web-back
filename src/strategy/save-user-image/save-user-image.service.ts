/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Strategy } from '../strategy';
import { UserDto } from 'src/user/user-dto/user-dto';
import { FlickrService } from 'src/flickr/flickr/flickr.service';
import { UserService } from 'src/user/user/user.service';

@Injectable()
export class SaveUserImageService implements Strategy<UserDto> {
  constructor(
    private readonly flickrService: FlickrService,
    private readonly userService: UserService,
  ) {}

  async saveImage(
    id: number,
    image: Buffer,
    title: string,
  ): Promise<UserDto> {
    const utilisateurDto = await this.userService.findOne(id);
    if (!utilisateurDto) {
      throw new NotFoundException(`Utilisateur with ID ${id} not found`);
    }

    const urlImage = await this.flickrService.uploadPhoto(image, title);
    if (!urlImage) {
      throw new Error('Error saving utilisateur image');
    }

    utilisateurDto.image = urlImage;
    return this.userService.save(utilisateurDto);
  }
}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FlickrService } from './flickr/flickr.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FlickrService],
  exports: [FlickrService],
})
export class FlickrModule {}

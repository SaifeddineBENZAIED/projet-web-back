/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//import { AxiosInstance } from 'axios';
//import * as FormData from 'form-data';
import { createFlickr } from "flickr-sdk"
//import { resolve } from "node:path"
/*import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';*/

@Injectable()
export class FlickrService {
  /*private axiosClient: AxiosInstance;
  private flickrUploadUrl = 'https://up.flickr.com/services/upload/';*/
  private apiKey: string = 'f10ff648591429d09558af6f0c5748aa';
  private apiSecret: string = '9233c3b810ae130f';
  private appKey: string = '72157720893259737-60a3e9ac7ccc0ea8';
  private appSecret: string = '89e341ed7bda1af3';

  constructor(private configService: ConfigService) {
    /*this.apiKey = this.configService.get<string>('f10ff648591429d09558af6f0c5748aa');
    this.apiSecret = this.configService.get<string>('9233c3b810ae130f');
    this.appKey = this.configService.get<string>('72157720893259737-60a3e9ac7ccc0ea8');
    this.appSecret = this.configService.get<string>('89e341ed7bda1af3');*/

    if (!this.apiKey || !this.apiSecret || !this.appKey || !this.appSecret) {
      throw new InternalServerErrorException('Flickr API credentials are not configured correctly.');
    }

    /*this.axiosClient = axios.create({
      baseURL: 'https://api.flickr.com/services/rest/',
      params: {
        api_key: this.apiKey,
        format: 'json',
        nojsoncallback: 1,
      },
    });

    this.axiosClient.interceptors.request.use((config) => {
      config.params = config.params || {};
      config.params.auth_token = this.appKey;
      config.params.api_sig = this.appSecret;
      return config;
    });*/
  }

  async uploadPhoto(image: Buffer, fileName: string): Promise<any> {
    /*const formData = new FormData();
    formData.append('photo', imageBuffer, { filename: fileName });*/

    /*const tempFilePath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(tempFilePath, imageBuffer);*/
  
    const { upload } = createFlickr({
      consumerKey: this.apiKey,
      consumerSecret: this.apiSecret,
      oauthToken: this.appKey,
      oauthTokenSecret: this.appSecret,
    })

    const imageAsString = image.toString('base64');
  
    try{
      const response = await upload(imageAsString, {
        title: fileName,
      })
      return response.id;
    } catch (error) {
      console.error('Error uploading photo to Flickr:', error);
      throw new InternalServerErrorException('Failed to upload photo to Flickr.');
    }/*finally {
      fs.unlinkSync(tempFilePath);
    }*/
  }
}

/* eslint-disable prettier/prettier */
import { Controller, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StrategyImageContextService } from 'src/strategy/strategy-image-context/strategy-image-context.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Configure disk storage
const storage = diskStorage({
  destination: './uploads', // Temporary upload directory
  filename: (req, file, callback) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${randomName}${extname(file.originalname)}`); // Generate a unique filename
  },
});


@Controller('image')
export class ImageController {
  constructor(
    private readonly strategyImageContextService: StrategyImageContextService,
  ) {}

  @Post('/save/:id/:title/:context')
  @UseInterceptors(FileInterceptor('file', { storage: storage }))
  async saveImage(
    @Param('id') id: number,
    @Param('title') title: string,
    @Param('context') context: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      /*// eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const path = require('path');

      const writeStream = fs.createWriteStream(path.join(__dirname, file.originalname));
      writeStream.write(file.buffer);
      writeStream.end();*/

      //const stream = createReadStream(file.path);

      const savedImage = await this.strategyImageContextService.saveImage(
        context,
        id,
        file.buffer,
        title,
      );
      return res.status(HttpStatus.CREATED).json(savedImage);
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}

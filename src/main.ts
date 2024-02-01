import { NestFactory /*Reflector*/ } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
/*import { RolesGuard } from './roles-guard/roles-guard';
import { UserService } from './user/user/user.service';
import { ClientService } from './client/client/client.service';*/
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*const reflector = app.get(Reflector);
  const userService = app.get(UserService);
  const clientService = app.get(ClientService);

  app.useGlobalGuards(new RolesGuard(reflector, userService, clientService));*/

  //app.useGlobalPipes(new ValidationPipe());

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'PATCH'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  };

  app.enableCors(corsOptions);

  await app.listen(3000);
}
bootstrap();

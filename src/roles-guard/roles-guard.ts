/* eslint-disable prettier/prettier */
/*import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientService } from 'src/client/client/client.service';
import { Role } from 'src/role';
import { UserService } from 'src/user/user/user.service';

@Injectable()*/
export class RolesGuard/* implements CanActivate*/ {
  /*constructor(private reflector: Reflector, private userService: UserService, private clientService: ClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { id } = request.user;
      const user = await this.userService.findOne(id);
      if(user){
        return roles.includes(user.role);
      }else{
        const client = await this.clientService.findOne(id);
        return roles.includes(client.role);
      }
    }

    return false;
  }*/
}

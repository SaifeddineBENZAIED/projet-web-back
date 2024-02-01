/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from '../client-dto/client-dto';
import { UpdateClientDto } from '../client-dto/update-client-dto';
import { ClientEntity } from '../client-entity/client-entity';
import { ChangePasswordDto } from 'src/change-password-dto';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

  @Post('/create')
  async create(@Body() clientDto: ClientDto): Promise<ClientEntity> {
    return this.clientService.create(clientDto);
  }

  @Get('/all')
  async findAll(): Promise<ClientEntity[]> {
    return this.clientService.findAll();
  }

  @Get('/find/:id')
  async findOne(@Param('id') id: number): Promise<ClientEntity> {
    return this.clientService.findOne(id);
  }

  @Get('/find/email/:email')
  async findByEmail(@Param('email') email: string): Promise<ClientEntity> {
    return this.clientService.findByEmail(email);
  }

  @Patch('/update/:id')
  async update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto): Promise<ClientEntity> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.clientService.remove(id);
  }

  @Post('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<ClientEntity> {
    return this.clientService.changePassword(changePasswordDto);
  }

  @Get('/top-spending')
  findTopSpendingClients(
      @Query('startDate') startDate?: Date,
      @Query('endDate') endDate?: Date
  ) {
        return this.clientService.findTopSpendingClients(startDate, endDate);
  }
}

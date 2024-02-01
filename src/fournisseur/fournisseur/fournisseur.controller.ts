/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FournisseurService } from './fournisseur.service';
import { FournisseurDto } from '../fournisseur-dto/fournisseur-dto';
import { UpdateFournisseurDto } from '../fournisseur-dto/update-fournisseur-dto';

@Controller('fournisseur')
export class FournisseurController {
    constructor(private readonly fournisseurService: FournisseurService) {}

    @Post('/create')
    create(@Body() fournisseurDto: FournisseurDto) {
        return this.fournisseurService.create(fournisseurDto);
    }

    @Get('/find')
    findAll() {
        return this.fournisseurService.findAll();
    }

    @Get('/find/:id')
    findOne(@Param('id') id: string) {
        return this.fournisseurService.findOne(+id);
    }

    @Patch('/update/:id')
    update(@Param('id') id: string, @Body() updateFournisseurDto: UpdateFournisseurDto) {
        return this.fournisseurService.update(+id, updateFournisseurDto);
    }

    @Delete('/delete/:id')
    remove(@Param('id') id: string) {
        return this.fournisseurService.remove(+id);
    }
}

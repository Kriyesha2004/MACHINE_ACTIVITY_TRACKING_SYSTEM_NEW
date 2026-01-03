import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MachinesService } from './machines.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('machines')
export class MachinesController {
    constructor(private readonly machinesService: MachinesService) { }

    @Get()
    async findAll() {
        return this.machinesService.findAll();
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    async create(@Body() createMachineDto: any, @UploadedFile() file: Express.Multer.File) {
        const imagePath = file ? file.path : undefined;
        return this.machinesService.create(createMachineDto, imagePath);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.machinesService.findOne(id);
    }
}

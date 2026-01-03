import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Machine, MachineDocument } from './schemas/machine.schema';

@Injectable()
export class MachinesService {
    constructor(@InjectModel(Machine.name) private machineModel: Model<MachineDocument>) { }

    async create(createMachineDto: any, imagePath?: string): Promise<Machine> {
        const newMachine = new this.machineModel({
            ...createMachineDto,
            imagePath,
        });
        return newMachine.save();
    }

    async findAll(): Promise<Machine[]> {
        return this.machineModel.find().exec();
    }

    async findOne(id: string): Promise<Machine | null> {
        return this.machineModel.findById(id).exec();
    }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MachineDocument = Machine & Document;

@Schema()
export class Machine {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    model: string;

    @Prop({ required: true })
    location: string;

    @Prop()
    serialNumber: string;

    @Prop()
    purchaseDate: string;

    @Prop()
    imagePath: string; // Path to the stored image

    @Prop({ default: 'active', enum: ['active', 'inactive', 'maintenance'] })
    status: string;

    @Prop()
    lastMaintenance: Date;

    @Prop()
    assignedTo: string;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaintenanceTemplateDocument = MaintenanceTemplate & Document;

@Schema({ timestamps: true, collection: 'maintenance_templates' })
export class MaintenanceTemplate {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: [String], default: [] })
    tasks: string[]; // List of checklist items

    @Prop({ required: true, enum: ['Daily', 'Monthly', '8-Weekly'] })
    frequency: string;

    @Prop({ type: [String], default: [] })
    targetMachineIds: string[]; // Machines this template applies to
}

export const MaintenanceTemplateSchema = SchemaFactory.createForClass(MaintenanceTemplate);

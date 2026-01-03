import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaintenanceRecordDocument = MaintenanceRecord & Document;

@Schema({ timestamps: true, collection: 'maintenance_records' })
export class MaintenanceRecord {
    @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
    machineId: string;

    @Prop({ type: Types.ObjectId, ref: 'MaintenancePlan', required: true })
    planId: string;

    @Prop({ required: true })
    frequency: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    performedBy: string;

    @Prop({
        type: [{
            task: String,
            isChecked: Boolean,
            photoUrl: String,
            notes: String
        }],
        default: []
    })
    checklist: {
        task: string;
        isChecked: boolean;
        photoUrl?: string;
        notes?: string;
    }[];

    @Prop()
    overallNotes: string;

    @Prop()
    evidenceUrl: string;
}

export const MaintenanceRecordSchema = SchemaFactory.createForClass(MaintenanceRecord);

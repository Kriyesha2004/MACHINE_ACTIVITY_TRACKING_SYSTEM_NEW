import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DailyLogDocument = DailyLog & Document;

@Schema({ timestamps: true })
export class DailyLog {
    @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
    machineId: string;

    @Prop({ required: true })
    date: string; // ISO Date string YYYY-MM-DD

    @Prop({ default: 'pending', enum: ['pending', 'completed', 'skipped'] })
    status: string;

    @Prop()
    notes: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    checkedBy: string; // User who performed the check
}

export const DailyLogSchema = SchemaFactory.createForClass(DailyLog);

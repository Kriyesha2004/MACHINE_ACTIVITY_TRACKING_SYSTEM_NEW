import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaintenancePlanDocument = MaintenancePlan & Document;

@Schema({ timestamps: true, collection: 'maintenance_plans' })
export class MaintenancePlan {
    @Prop({ required: true })
    name: string; // e.g., "Daily Check - Machine A"

    @Prop({ type: Types.ObjectId, ref: 'MaintenanceTemplate', required: true })
    templateId: string; // Link to the definition

    @Prop({ required: true, enum: ['Daily', 'Monthly', '8-Weekly'] })
    frequency: string; // Drives the routing

    @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
    machineId: string; // Single table for all plans

    @Prop({ type: Types.ObjectId, ref: 'User' })
    assignedEmployeeId: string; // Nullable for Daily, Optional Monthly, Mandatory 8-Weekly

    @Prop({ required: true })
    scheduledDate: Date;

    @Prop({ default: 'active', enum: ['planned', 'active', 'completed', 'overdue', 'archived'] })
    status: string;

    @Prop({ type: [String], default: [] })
    completedTasks: string[];

    @Prop()
    notes: string;

    @Prop()
    evidenceUrl?: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    performedBy?: string; // Who actually completed the task (especially for Daily/unassigned)
}

export const MaintenancePlanSchema = SchemaFactory.createForClass(MaintenancePlan);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['admin', 'employee', 'supervisor', 'technician'], default: 'employee' })
    role: string;

    @Prop({ required: true })
    department: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceTemplate, MaintenanceTemplateSchema } from './schemas/template.schema';
import { MaintenancePlan, MaintenancePlanSchema } from './schemas/maintenance-plan.schema';
import { MaintenanceRecord, MaintenanceRecordSchema } from './schemas/maintenance-record.schema';
import { DailyLog, DailyLogSchema } from './schemas/daily-log.schema';
import { MachinesModule } from '../machines/machines.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DailyLog.name, schema: DailyLogSchema },
            { name: MaintenanceTemplate.name, schema: MaintenanceTemplateSchema },
            { name: MaintenancePlan.name, schema: MaintenancePlanSchema },
            { name: MaintenanceRecord.name, schema: MaintenanceRecordSchema },
        ]),
        MachinesModule,
    ],
    controllers: [MaintenanceController],
    providers: [MaintenanceService],
    exports: [MaintenanceService],
})
export class MaintenanceModule { }

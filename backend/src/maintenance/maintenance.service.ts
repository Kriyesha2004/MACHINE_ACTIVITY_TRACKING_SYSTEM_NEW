import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyLog, DailyLogDocument } from './schemas/daily-log.schema';
import { MachinesService } from '../machines/machines.service';
import { MaintenanceTemplate, MaintenanceTemplateDocument } from './schemas/template.schema';
import { MaintenancePlan, MaintenancePlanDocument } from './schemas/maintenance-plan.schema';
import { MaintenanceRecord, MaintenanceRecordDocument } from './schemas/maintenance-record.schema';

@Injectable()
export class MaintenanceService {
    constructor(
        @InjectModel(DailyLog.name) private dailyLogModel: Model<DailyLogDocument>,
        @InjectModel(MaintenanceTemplate.name) private templateModel: Model<MaintenanceTemplateDocument>,
        @InjectModel(MaintenancePlan.name) private planModel: Model<MaintenancePlanDocument>,
        @InjectModel(MaintenanceRecord.name) private maintenanceRecordModel: Model<MaintenanceRecordDocument>,
        private machinesService: MachinesService,
    ) { }

    // --- Daily Checklist Logic ---

    async getDailyStatus(date: string) {
        // ... (existing logic)
        const dailyPlans = await this.planModel.find({
            frequency: 'Daily',
            status: { $in: ['active', 'planned'] }
        }).populate('machineId').exec();

        const logs = await this.dailyLogModel.find({ date }).exec();

        return dailyPlans.map(plan => {
            const machine = plan.machineId as any;
            const log = logs.find(l => l.machineId.toString() === machine._id.toString());

            return {
                planId: plan._id,
                machine,
                status: log ? log.status : 'pending', // or plan.status
                notes: log ? log.notes : '',
            };
        });
    }

    async updateDailyLog(data: { machineId: string; date: string; status: string; notes?: string }) {
        return this.dailyLogModel.findOneAndUpdate(
            { machineId: data.machineId, date: data.date },
            { status: data.status, notes: data.notes },
            { new: true, upsert: true }
        ).exec();
    }

    // --- Template Logic ---

    async createTemplate(data: any) {
        // Validation for simple fields if needed
        const newTemplate = new this.templateModel(data);
        return newTemplate.save();
    }

    async getTemplates(frequency?: string) {
        const filter = frequency ? { frequency } : {};
        return this.templateModel.find(filter).exec();
    }

    // --- Planner Logic (The Core Requirement) ---

    async createScheduledPlans(data: {
        name: string;
        templateId: string;
        startDate: string;
        endDate: string;
        allocations: { machineId: string; assignedUserId?: string }[];
    }) {
        // 1. Fetch Template
        const template = await this.templateModel.findById(data.templateId);
        if (!template) throw new BadRequestException('Template not found');

        // 2. Validate Allocations
        if (!data.allocations || data.allocations.length === 0) {
            throw new BadRequestException('No machines selected for this plan.');
        }

        const validAllocations: any[] = [];
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
             throw new BadRequestException('Invalid date range.');
        }

        for (const allocation of data.allocations) {
            let assignedUser = allocation.assignedUserId;

            // Rule Check: 8-Weekly requires assignment
            if (template.frequency === '8-Weekly' && !assignedUser) {
                throw new BadRequestException(`Machine ${allocation.machineId} requires an assigned employee for 8-Weekly maintenance.`);
            }

            // Rule Check: Daily does not use assignment (force null/undefined)
            if (template.frequency === 'Daily') {
                assignedUser = undefined;
            }

            // --- Recurring Generation Loop ---
            let currentDate = new Date(start);
            let cycleIndex = 1;

            while (currentDate <= end) {
                let planName = data.name || `${template.name} - ${template.frequency}`;
                
                // For 8-Weekly, add cycle info to help distinguish
                if (template.frequency === '8-Weekly') {
                    planName += ` (Cycle ${cycleIndex})`;
                }

                validAllocations.push({
                    name: planName,
                    templateId: template._id,
                    frequency: template.frequency,
                    machineId: allocation.machineId,
                    assignedEmployeeId: assignedUser,
                    scheduledDate: new Date(currentDate), 
                    status: 'planned',
                    notes: `Recurring Plan: ${new Date(currentDate).toLocaleDateString()}`
                });

                // Increment Date based on Frequency
                if (template.frequency === 'Daily') {
                    currentDate.setDate(currentDate.getDate() + 1);
                } else if (template.frequency === 'Monthly') {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                } else if (template.frequency === '8-Weekly') {
                     currentDate.setDate(currentDate.getDate() + 56);
                     cycleIndex++;
                } else {
                    // Safety break for unknown frequency to prevent infinite loop
                    break;
                }
            }
        }

        // 3. Bulk Create
        // chunking could be considered for very large ranges, but fine for now
        const createdPlans = await this.planModel.insertMany(validAllocations);
        return createdPlans;
    }

    async getPlansByFrequency(frequency: string) {
        // This powers the UI "Filters"
        return this.planModel.find({ frequency })
            .populate('machineId')
            .populate('assignedEmployeeId')
            .populate('performedBy', 'name')
            .sort({ scheduledDate: 1 })
            .exec();
    }

    // --- Update Logic ---

    async updateAllocation(planId: string, updates: { status?: string; notes?: string; completedTasks?: string[]; evidenceUrl?: string }) {
        const plan = await this.planModel.findById(planId);
        if (!plan) throw new BadRequestException('Plan not found');

        if (updates.status) plan.status = updates.status;
        if (updates.notes) plan.notes = updates.notes;
        if (updates.completedTasks) plan.completedTasks = updates.completedTasks;
        if (updates.evidenceUrl) plan.evidenceUrl = updates.evidenceUrl;

        // If completed, we might want to trigger record creation?
        // For now, let's just save the plan.
        if (updates.status === 'completed') {
            // We should ideally create the record here if this is the "final" call.
            // But let's just save the plan for now to satisfy the "evidence upload" requirement.
            // Explicitly creating record logic can be added/refined later if strictly needed.
            // The user asked for "evidence part".
        }

        return plan.save();
    }

    async assignPlan(planId: string, employeeId: string) {
        const plan = await this.planModel.findById(planId);
        if (!plan) throw new BadRequestException('Plan not found');

        plan.assignedEmployeeId = employeeId;
        plan.status = 'active'; // Ensure it's active when assigned
        return plan.save();
    }

    async completePlan(planId: string, data: {
        checklist: { task: string; isChecked: boolean; photoUrl?: string; notes?: string }[];
        overallNotes?: string;
        performedBy?: string;
        evidenceUrl?: string;
    }) {
        const plan = await this.planModel.findById(planId);
        if (!plan) throw new BadRequestException('Plan not found');

        // Ensure frequency is available (for older plans or migration issues)
        if (!plan.frequency) {
            const template = await this.templateModel.findById(plan.templateId);
            plan.frequency = template ? template.frequency : 'Daily'; // Fallback
        }

        // Create the permanent record
        const record = new this.maintenanceRecordModel({
            machineId: plan.machineId,
            planId: plan._id,
            frequency: plan.frequency,
            date: new Date(),
            performedBy: data.performedBy || plan.assignedEmployeeId,
            checklist: data.checklist,
            overallNotes: data.overallNotes,
            evidenceUrl: data.evidenceUrl
        });
        await record.save();

        // Update plan status
        plan.status = 'completed';
        plan.notes = data.overallNotes || '';
        plan.evidenceUrl = data.evidenceUrl; // Save evidence to plan as well
        plan.performedBy = data.performedBy || plan.assignedEmployeeId; // Capture who did it

        // Store simple list of completed tasks for backward compatibility if needed, 
        // or just rely on the record. Let's populate specific compatible field.
        plan.completedTasks = data.checklist.filter(c => c.isChecked).map(c => c.task);

        await plan.save();
        return record;
    }

    async uploadEvidence(file: Express.Multer.File) {
        // In a real app, upload to S3/Cloudinary and return URL.
        // Here we just return the local path served statically.
        // Assuming static serve is set up for 'uploads' folder.
        // If not, we might need a controller to serve it, but let's assume standard static setup.
        // Returning relative path matching ServeStaticModule 'serveRoot'
        return { url: `uploads/${file.filename}` };
    }

    // Generic
    async getActivePlans() {
        return this.planModel.find({ status: { $in: ['active', 'planned'] } })
            .populate('machineId')
            .exec();
    }

    async getPlanById(id: string) {
        return this.planModel.findById(id)
            .populate('machineId')
            .populate('templateId') // We need the template tasks
            .populate('assignedEmployeeId')
            .exec();
    }
    async getMachineHistory(machineId: string, limit: number = 5) {
        return this.maintenanceRecordModel.find({ machineId })
            .sort({ date: -1 })
            .limit(limit)
            .populate('performedBy', 'name') // Assuming User model has name
            .exec();
    }

    async getUpcomingPlans(machineId: string) {
        return this.planModel.find({
            machineId,
            status: { $in: ['active', 'planned'] }
        })
            .sort({ scheduledDate: 1 })
            .limit(3)
            .populate('assignedEmployeeId', 'name')
            .exec();
    }

    async getAllHistory(limit: number = 20) {
        return this.maintenanceRecordModel.find()
            .sort({ date: -1 })
            .limit(limit)
            .populate('machineId', 'name location')
            .populate('performedBy', 'name')
            .exec();
    }
}

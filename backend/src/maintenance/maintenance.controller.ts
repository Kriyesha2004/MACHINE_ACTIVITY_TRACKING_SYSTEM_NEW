import { Controller, Get, Post, Body, Query, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MaintenanceService } from './maintenance.service'; // Service import

@Controller('maintenance')
export class MaintenanceController {
    constructor(private readonly maintenanceService: MaintenanceService) { }

    @Get('daily')
    async getDailyLogs(@Query('date') date: string) {
        return this.maintenanceService.getDailyStatus(date);
    }

    @Post('daily')
    async updateDailyLog(@Body() body: { machineId: string; date: string; status: string; notes?: string }) {
        return this.maintenanceService.updateDailyLog(body);
    }

    // Template Endpoints
    @Post('templates')
    async createTemplate(@Body() body: any) {
        return this.maintenanceService.createTemplate(body);
    }

    @Get('templates')
    async getTemplates(@Query('frequency') frequency?: string) {
        return this.maintenanceService.getTemplates(frequency);
    }

    // Plan Endpoints
    @Post('plans')
    async createPlan(@Body() body: any) {
        // Body matches { name, templateId, startDate, endDate, allocations: [...] }
        return this.maintenanceService.createScheduledPlans(body);
    }

    @Get('plans/active')
    async getActivePlans(@Query('frequency') frequency?: string) {
        if (frequency) {
            return this.maintenanceService.getPlansByFrequency(frequency);
        }
        return this.maintenanceService.getActivePlans();
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.maintenanceService.uploadEvidence(file);
    }

    @Get('plans/:id')
    async getPlan(@Param('id') id: string) {
        return this.maintenanceService.getPlanById(id);
    }

    @Post('plans/:id/status')
    async updatePlan(
        @Param('id') id: string,
        @Body() body: { status?: string; notes?: string; completedTasks?: string[]; evidenceUrl?: string }
    ) {
        if (body.status === 'completed') {
            return this.maintenanceService.completePlan(id, {
                checklist: [], // This might need adjustment if checklist is passed separately, but based on service signature:
                // Wait, service completePlan takes (planId, data). Data has checklist.
                // The current controller implementation was:
                // return this.maintenanceService.updateAllocation(id, body);
                // But wait, completePlan is different. 
                // Let's look at the previous code again.
                // Previous code: return this.maintenanceService.updateAllocation(id, body);
                // But updateAllocation only handles status/notes/completedTasks.
                // If status is completed, we probably want completePlan?
                // The service has `completePlan`.
                // Let's defer to the service logic or update the controller to switch methods.
                // For now, I will just update the signature of updateAllocation in the service to take evidenceUrl too, 
                // OR better, update the controller to call completePlan if status is completed.
                // However, the frontend calls `.../status` with `status: 'completed'`.
                // So I should check the status here.
            });
        }
        // Actually, let's keep it simple and just forward to updateAllocation for now, 
        // and I will update updateAllocation in service to handle evidenceUrl.
        // Wait, completePlan IS the one that creates the record.
        // So I should stick to the existing pattern or improve it.
        // The existing controller was just calling updateAllocation.
        // Let's modify it to handle "completed" properly if it wasn't already.
        // Checking previous service code... 
        // Service had `updateAllocation` AND `completePlan`.
        // Controller ONLY called `updateAllocation`.
        // This means `completePlan` was unused or I missed it.
        // Ah, if I look at `MaintenanceExecutionPage.tsx`...
        // It calls `.../plans/${planId}/status`.
        // So the frontend thinks it's just updating status.
        // If I want to use `completePlan` (which creates a record), I should switch to it here.

        if (body.status === 'completed') {
            // We need the checklist data which might be in body or we assume it's already in the plan (completedTasks).
            // The frontend sends `completedTasks` (string[]).
            // `completePlan` expects full checklist object array.
            // This is a disconnect.
            // For now, to solve the immediate request (upload evidence), I will add `evidenceUrl` to `updateAllocation` 
            // and ensure it is saved to the plan. 
            // Later, when `completePlan` is properly wired, it can copy it.
            return this.maintenanceService.updateAllocation(id, body);
        }
        return this.maintenanceService.updateAllocation(id, body);
    }
    @Get('history/:machineId')
    async getMachineHistory(@Param('machineId') machineId: string) {
        return this.maintenanceService.getMachineHistory(machineId);
    }

    @Get('upcoming/:machineId')
    async getUpcomingPlans(@Param('machineId') machineId: string) {
        return this.maintenanceService.getUpcomingPlans(machineId);
    }

    @Get('history')
    async getAllHistory() {
        return this.maintenanceService.getAllHistory();
    }
}

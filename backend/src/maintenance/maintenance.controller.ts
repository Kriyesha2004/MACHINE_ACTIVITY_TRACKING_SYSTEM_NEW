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

    @Post('plans/:id/assign')
    async assignPlan(
        @Param('id') id: string,
        @Body() body: { employeeId: string }
    ) {
        return this.maintenanceService.assignPlan(id, body.employeeId);
    }

    @Post('plans/:id/status')
    async updatePlan(
        @Param('id') id: string,
        @Body() body: { status?: string; notes?: string; completedTasks?: string[]; evidenceUrl?: string; performedBy?: string; checklist?: any[] }
    ) {
        if (body.status === 'completed') {
            return this.maintenanceService.completePlan(id, {
                checklist: body.checklist || [],
                overallNotes: body.notes,
                evidenceUrl: body.evidenceUrl,
                performedBy: body.performedBy
            });
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

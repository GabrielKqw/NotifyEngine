/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const bullmq_1 = __webpack_require__(5);
const prisma_module_1 = __webpack_require__(6);
const health_controller_1 = __webpack_require__(9);
const automations_module_1 = __webpack_require__(10);
const executions_module_1 = __webpack_require__(20);
const smtp_config_module_1 = __webpack_require__(23);
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                }),
            }),
            prisma_module_1.PrismaModule,
            automations_module_1.AutomationsModule,
            executions_module_1.ExecutionsModule,
            smtp_config_module_1.SmtpConfigModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [],
    })
], ApiModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/bullmq");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(7);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(8);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(3);
let HealthController = class HealthController {
    getHealth() {
        return {
            status: 'ok',
            service: 'notify-api',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health')
], HealthController);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutomationsModule = void 0;
const bullmq_1 = __webpack_require__(5);
const common_1 = __webpack_require__(3);
const queue_constants_1 = __webpack_require__(11);
const automations_controller_1 = __webpack_require__(12);
const automations_service_1 = __webpack_require__(13);
let AutomationsModule = class AutomationsModule {
};
exports.AutomationsModule = AutomationsModule;
exports.AutomationsModule = AutomationsModule = __decorate([
    (0, common_1.Module)({
        imports: [bullmq_1.BullModule.registerQueue({ name: queue_constants_1.EXECUTION_QUEUE })],
        controllers: [automations_controller_1.AutomationsController],
        providers: [automations_service_1.AutomationsService],
        exports: [automations_service_1.AutomationsService],
    })
], AutomationsModule);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EXECUTION_JOB = exports.EXECUTION_QUEUE = void 0;
exports.EXECUTION_QUEUE = 'execution-queue';
exports.EXECUTION_JOB = 'run-execution';


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutomationsController = void 0;
const common_1 = __webpack_require__(3);
const automations_service_1 = __webpack_require__(13);
const create_automation_dto_1 = __webpack_require__(16);
const trigger_manual_dto_1 = __webpack_require__(19);
let AutomationsController = class AutomationsController {
    automationsService;
    constructor(automationsService) {
        this.automationsService = automationsService;
    }
    list(workspaceId) {
        return this.automationsService.listByWorkspace(workspaceId);
    }
    create(dto) {
        return this.automationsService.create(dto);
    }
    triggerManual(automationId, dto) {
        return this.automationsService.triggerManual(automationId, dto);
    }
};
exports.AutomationsController = AutomationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AutomationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_automation_dto_1.CreateAutomationDto !== "undefined" && create_automation_dto_1.CreateAutomationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AutomationsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/trigger/manual'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof trigger_manual_dto_1.TriggerManualDto !== "undefined" && trigger_manual_dto_1.TriggerManualDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AutomationsController.prototype, "triggerManual", null);
exports.AutomationsController = AutomationsController = __decorate([
    (0, common_1.Controller)('automations'),
    __metadata("design:paramtypes", [typeof (_a = typeof automations_service_1.AutomationsService !== "undefined" && automations_service_1.AutomationsService) === "function" ? _a : Object])
], AutomationsController);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutomationsService = void 0;
const bullmq_1 = __webpack_require__(5);
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(8);
const bullmq_2 = __webpack_require__(14);
const crypto_1 = __webpack_require__(15);
const prisma_service_1 = __webpack_require__(7);
const queue_constants_1 = __webpack_require__(11);
let AutomationsService = class AutomationsService {
    prisma;
    executionQueue;
    constructor(prisma, executionQueue) {
        this.prisma = prisma;
        this.executionQueue = executionQueue;
    }
    listByWorkspace(workspaceId) {
        return this.prisma.automation.findMany({
            where: { workspaceId, deletedAt: null },
            include: {
                triggers: true,
                conditions: true,
                actions: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(dto) {
        const triggers = dto.triggers?.length
            ? dto.triggers
            : [{ type: client_1.TriggerType.MANUAL, config: { source: 'default' }, isActive: true }];
        const actions = dto.actions?.length
            ? dto.actions
            : [{ type: client_1.ActionType.INTERNAL_LOG, config: { message: 'Default action' }, order: 0, isActive: true }];
        const conditions = dto.conditions ?? [];
        return this.prisma.automation.create({
            data: {
                workspaceId: dto.workspaceId,
                templateId: dto.templateId,
                name: dto.name,
                description: dto.description,
                status: dto.status,
                isActive: dto.isActive ?? false,
                triggers: {
                    create: triggers.map((trigger) => ({
                        type: trigger.type,
                        config: trigger.config,
                        isActive: trigger.isActive ?? true,
                    })),
                },
                conditions: {
                    create: conditions.map((condition, idx) => ({
                        type: condition.type ?? client_1.ConditionType.CUSTOM_JSON_RULE,
                        config: condition.config,
                        order: condition.order ?? idx,
                        isActive: condition.isActive ?? true,
                    })),
                },
                actions: {
                    create: actions.map((action, idx) => ({
                        type: action.type,
                        config: action.config,
                        order: action.order ?? idx,
                        isActive: action.isActive ?? true,
                    })),
                },
            },
            include: {
                triggers: true,
                conditions: true,
                actions: true,
            },
        });
    }
    async triggerManual(automationId, dto) {
        const automation = await this.prisma.automation.findFirst({
            where: {
                id: automationId,
                workspaceId: dto.workspaceId,
                deletedAt: null,
            },
            include: {
                triggers: {
                    where: {
                        type: client_1.TriggerType.MANUAL,
                        isActive: true,
                        deletedAt: null,
                    },
                    take: 1,
                },
            },
        });
        if (!automation) {
            throw new common_1.NotFoundException('Automation not found');
        }
        const manualTrigger = automation.triggers[0] ?? null;
        const idempotencyKey = dto.idempotencyKey ?? (0, crypto_1.randomUUID)();
        const execution = await this.prisma.execution.create({
            data: {
                workspaceId: dto.workspaceId,
                automationId: automation.id,
                triggerId: manualTrigger?.id,
                sourceEventId: (0, crypto_1.randomUUID)(),
                idempotencyKey,
                context: (dto.context ?? {}),
            },
        });
        await this.executionQueue.add(queue_constants_1.EXECUTION_JOB, { executionId: execution.id }, {
            jobId: execution.id,
            attempts: execution.maxRetries + 1,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: 1000,
            removeOnFail: 1000,
        });
        return {
            executionId: execution.id,
            queued: true,
        };
    }
};
exports.AutomationsService = AutomationsService;
exports.AutomationsService = AutomationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(queue_constants_1.EXECUTION_QUEUE)),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _b : Object])
], AutomationsService);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAutomationDto = void 0;
const client_1 = __webpack_require__(8);
const class_validator_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(18);
class CreateTriggerDto {
    type;
    config;
    isActive;
}
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TriggerType),
    __metadata("design:type", typeof (_a = typeof client_1.TriggerType !== "undefined" && client_1.TriggerType) === "function" ? _a : Object)
], CreateTriggerDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], CreateTriggerDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTriggerDto.prototype, "isActive", void 0);
class CreateConditionDto {
    type;
    config;
    order;
    isActive;
}
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ConditionType),
    __metadata("design:type", typeof (_c = typeof client_1.ConditionType !== "undefined" && client_1.ConditionType) === "function" ? _c : Object)
], CreateConditionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_d = typeof Record !== "undefined" && Record) === "function" ? _d : Object)
], CreateConditionDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateConditionDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConditionDto.prototype, "isActive", void 0);
class CreateActionDto {
    type;
    config;
    order;
    isActive;
}
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ActionType),
    __metadata("design:type", typeof (_e = typeof client_1.ActionType !== "undefined" && client_1.ActionType) === "function" ? _e : Object)
], CreateActionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_f = typeof Record !== "undefined" && Record) === "function" ? _f : Object)
], CreateActionDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateActionDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateActionDto.prototype, "isActive", void 0);
class CreateAutomationDto {
    workspaceId;
    name;
    description;
    templateId;
    status;
    isActive;
    triggers;
    conditions;
    actions;
}
exports.CreateAutomationDto = CreateAutomationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAutomationDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAutomationDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAutomationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAutomationDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AutomationStatus),
    __metadata("design:type", typeof (_g = typeof client_1.AutomationStatus !== "undefined" && client_1.AutomationStatus) === "function" ? _g : Object)
], CreateAutomationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAutomationDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateTriggerDto),
    __metadata("design:type", Array)
], CreateAutomationDto.prototype, "triggers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateConditionDto),
    __metadata("design:type", Array)
], CreateAutomationDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateActionDto),
    __metadata("design:type", Array)
], CreateAutomationDto.prototype, "actions", void 0);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TriggerManualDto = void 0;
const class_validator_1 = __webpack_require__(17);
class TriggerManualDto {
    workspaceId;
    idempotencyKey;
    context;
}
exports.TriggerManualDto = TriggerManualDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriggerManualDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriggerManualDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], TriggerManualDto.prototype, "context", void 0);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExecutionsModule = void 0;
const common_1 = __webpack_require__(3);
const executions_controller_1 = __webpack_require__(21);
const executions_service_1 = __webpack_require__(22);
let ExecutionsModule = class ExecutionsModule {
};
exports.ExecutionsModule = ExecutionsModule;
exports.ExecutionsModule = ExecutionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [executions_controller_1.ExecutionsController],
        providers: [executions_service_1.ExecutionsService],
        exports: [executions_service_1.ExecutionsService],
    })
], ExecutionsModule);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExecutionsController = void 0;
const common_1 = __webpack_require__(3);
const executions_service_1 = __webpack_require__(22);
let ExecutionsController = class ExecutionsController {
    executionsService;
    constructor(executionsService) {
        this.executionsService = executionsService;
    }
    getById(id, workspaceId) {
        return this.executionsService.getById(id, workspaceId);
    }
};
exports.ExecutionsController = ExecutionsController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExecutionsController.prototype, "getById", null);
exports.ExecutionsController = ExecutionsController = __decorate([
    (0, common_1.Controller)('executions'),
    __metadata("design:paramtypes", [typeof (_a = typeof executions_service_1.ExecutionsService !== "undefined" && executions_service_1.ExecutionsService) === "function" ? _a : Object])
], ExecutionsController);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExecutionsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(7);
let ExecutionsService = class ExecutionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getById(id, workspaceId) {
        const execution = await this.prisma.execution.findFirst({
            where: {
                id,
                workspaceId,
            },
            include: {
                automation: true,
                attempts: {
                    orderBy: { createdAt: 'asc' },
                },
                logs: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!execution) {
            throw new common_1.NotFoundException('Execution not found');
        }
        return execution;
    }
};
exports.ExecutionsService = ExecutionsService;
exports.ExecutionsService = ExecutionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ExecutionsService);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmtpConfigModule = void 0;
const common_1 = __webpack_require__(3);
const smtp_config_controller_1 = __webpack_require__(24);
const smtp_config_service_1 = __webpack_require__(27);
let SmtpConfigModule = class SmtpConfigModule {
};
exports.SmtpConfigModule = SmtpConfigModule;
exports.SmtpConfigModule = SmtpConfigModule = __decorate([
    (0, common_1.Module)({
        controllers: [smtp_config_controller_1.SmtpConfigController],
        providers: [smtp_config_service_1.SmtpConfigService],
        exports: [smtp_config_service_1.SmtpConfigService],
    })
], SmtpConfigModule);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmtpConfigController = void 0;
const common_1 = __webpack_require__(3);
const send_test_email_dto_1 = __webpack_require__(25);
const upsert_smtp_config_dto_1 = __webpack_require__(26);
const smtp_config_service_1 = __webpack_require__(27);
let SmtpConfigController = class SmtpConfigController {
    smtpConfigService;
    constructor(smtpConfigService) {
        this.smtpConfigService = smtpConfigService;
    }
    getByWorkspace(workspaceId) {
        return this.smtpConfigService.getByWorkspace(workspaceId);
    }
    upsert(dto) {
        return this.smtpConfigService.upsert(dto);
    }
    sendTest(dto) {
        return this.smtpConfigService.sendTestEmail(dto);
    }
};
exports.SmtpConfigController = SmtpConfigController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SmtpConfigController.prototype, "getByWorkspace", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof upsert_smtp_config_dto_1.UpsertSmtpConfigDto !== "undefined" && upsert_smtp_config_dto_1.UpsertSmtpConfigDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SmtpConfigController.prototype, "upsert", null);
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof send_test_email_dto_1.SendTestEmailDto !== "undefined" && send_test_email_dto_1.SendTestEmailDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], SmtpConfigController.prototype, "sendTest", null);
exports.SmtpConfigController = SmtpConfigController = __decorate([
    (0, common_1.Controller)('smtp-config'),
    __metadata("design:paramtypes", [typeof (_a = typeof smtp_config_service_1.SmtpConfigService !== "undefined" && smtp_config_service_1.SmtpConfigService) === "function" ? _a : Object])
], SmtpConfigController);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendTestEmailDto = void 0;
const class_validator_1 = __webpack_require__(17);
class SendTestEmailDto {
    workspaceId;
    to;
    subject;
}
exports.SendTestEmailDto = SendTestEmailDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendTestEmailDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendTestEmailDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendTestEmailDto.prototype, "subject", void 0);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpsertSmtpConfigDto = void 0;
const class_transformer_1 = __webpack_require__(18);
const class_validator_1 = __webpack_require__(17);
class UpsertSmtpConfigDto {
    workspaceId;
    host;
    port;
    secure;
    username;
    password;
    fromName;
    fromEmail;
    isActive;
}
exports.UpsertSmtpConfigDto = UpsertSmtpConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertSmtpConfigDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertSmtpConfigDto.prototype, "host", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(65535),
    __metadata("design:type", Number)
], UpsertSmtpConfigDto.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertSmtpConfigDto.prototype, "secure", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertSmtpConfigDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertSmtpConfigDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertSmtpConfigDto.prototype, "fromName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpsertSmtpConfigDto.prototype, "fromEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertSmtpConfigDto.prototype, "isActive", void 0);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmtpConfigService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(7);
const nodemailer = __importStar(__webpack_require__(28));
const secret_util_1 = __webpack_require__(29);
let SmtpConfigService = class SmtpConfigService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByWorkspace(workspaceId) {
        const config = await this.prisma.smtpConfig.findUnique({
            where: { workspaceId },
        });
        if (!config || config.deletedAt) {
            return null;
        }
        return this.sanitize(config);
    }
    async upsert(dto) {
        const encryptedPassword = (0, secret_util_1.encryptSecret)(dto.password);
        const config = await this.prisma.smtpConfig.upsert({
            where: { workspaceId: dto.workspaceId },
            update: {
                host: dto.host,
                port: dto.port,
                secure: dto.secure,
                username: dto.username,
                password: encryptedPassword,
                fromName: dto.fromName,
                fromEmail: dto.fromEmail,
                isActive: dto.isActive ?? true,
                deletedAt: null,
            },
            create: {
                workspaceId: dto.workspaceId,
                host: dto.host,
                port: dto.port,
                secure: dto.secure,
                username: dto.username,
                password: encryptedPassword,
                fromName: dto.fromName,
                fromEmail: dto.fromEmail,
                isActive: dto.isActive ?? true,
            },
        });
        return this.sanitize(config);
    }
    async sendTestEmail(dto) {
        const config = await this.prisma.smtpConfig.findUnique({
            where: { workspaceId: dto.workspaceId },
        });
        if (!config || config.deletedAt || !config.isActive) {
            throw new common_1.NotFoundException('Active SMTP config not found for workspace');
        }
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.username,
                pass: (0, secret_util_1.decryptSecret)(config.password),
            },
        });
        await transporter.verify();
        const result = await transporter.sendMail({
            from: config.fromName ? `${config.fromName} <${config.fromEmail}>` : config.fromEmail,
            to: dto.to,
            subject: dto.subject ?? 'Notify SMTP test',
            text: 'SMTP configuration test sent by Notify.',
        });
        return {
            accepted: result.accepted,
            rejected: result.rejected,
            messageId: result.messageId,
        };
    }
    sanitize(config) {
        const { password: _password, ...safe } = config;
        return safe;
    }
};
exports.SmtpConfigService = SmtpConfigService;
exports.SmtpConfigService = SmtpConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SmtpConfigService);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encryptSecret = encryptSecret;
exports.decryptSecret = decryptSecret;
const crypto_1 = __webpack_require__(15);
function getKey() {
    const material = process.env.APP_ENCRYPTION_KEY;
    if (!material || material.length < 32) {
        throw new Error('APP_ENCRYPTION_KEY must be set with at least 32 characters');
    }
    return (0, crypto_1.createHash)('sha256').update(material).digest();
}
function encryptSecret(plainText) {
    const iv = (0, crypto_1.randomBytes)(12);
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `enc:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}
function decryptSecret(value) {
    if (!value.startsWith('enc:')) {
        return value;
    }
    const [, ivB64, tagB64, dataB64] = value.split(':');
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', getKey(), Buffer.from(ivB64, 'base64'));
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    const plain = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]);
    return plain.toString('utf8');
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const api_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(api_module_1.ApiModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: false,
    }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

})();

/******/ })()
;
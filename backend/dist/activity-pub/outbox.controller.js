"use strict";
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
var OutboxController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxController = void 0;
const common_1 = require("@nestjs/common");
let OutboxController = exports.OutboxController = OutboxController_1 = class OutboxController {
    constructor() {
        this.logger = new common_1.Logger(OutboxController_1.name);
    }
    outbox(name, req, res) {
        this.logger.log(`Outbox : ${name}`, req.body);
        console.log(req.body);
        return res.status(common_1.HttpStatus.OK).type('application/activity+json').end();
    }
};
__decorate([
    (0, common_1.Post)('users/:name/outbox'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Object)
], OutboxController.prototype, "outbox", null);
exports.OutboxController = OutboxController = OutboxController_1 = __decorate([
    (0, common_1.Controller)('api/activity-pub')
], OutboxController);
//# sourceMappingURL=outbox.controller.js.map
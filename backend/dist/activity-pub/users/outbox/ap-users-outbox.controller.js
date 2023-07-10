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
var APUsersOutboxController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APUsersOutboxController = void 0;
const common_1 = require("@nestjs/common");
const host_url_service_1 = require("../../../shared/services/host-url.service");
const users_service_1 = require("../../../users/users.service");
let APUsersOutboxController = exports.APUsersOutboxController = APUsersOutboxController_1 = class APUsersOutboxController {
    constructor(hostUrlService, usersService) {
        this.hostUrlService = hostUrlService;
        this.usersService = usersService;
        this.logger = new common_1.Logger(APUsersOutboxController_1.name);
    }
    async outbox(name, req, res) {
        this.logger.log(`Outbox : ${name}`, req.body);
        const user = await this.usersService.findOne(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
        const fqdn = this.hostUrlService.fqdn;
        const json = {
            id: `${fqdn}/api/activity-pub/users/${name}/outbox`,
            type: 'OrderedCollection',
            totalItems: 1,
            first: `${fqdn}/api/activity-pub/users/${name}/notes`,
        };
        return res.status(common_1.HttpStatus.OK).type('application/activity+json').json(json);
    }
};
__decorate([
    (0, common_1.Post)(':name/outbox'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], APUsersOutboxController.prototype, "outbox", null);
exports.APUsersOutboxController = APUsersOutboxController = APUsersOutboxController_1 = __decorate([
    (0, common_1.Controller)('api/activity-pub/users'),
    __metadata("design:paramtypes", [host_url_service_1.HostUrlService,
        users_service_1.UsersService])
], APUsersOutboxController);
//# sourceMappingURL=ap-users-outbox.controller.js.map
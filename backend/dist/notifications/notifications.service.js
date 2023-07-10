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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_1 = require("../entities/notification");
const actor_object_service_1 = require("../shared/services/actor-object.service");
let NotificationsService = exports.NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationsRepository, actorObjectSerice) {
        this.notificationsRepository = notificationsRepository;
        this.actorObjectSerice = actorObjectSerice;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async createFollow(userName, actorObject) {
        try {
            const notification = new notification_1.Notification({
                userName: userName,
                type: 'follow',
                actorName: this.actorObjectSerice.getActorUserName(actorObject),
                remoteHost: this.actorObjectSerice.getRemoteHost(actorObject)
            });
            await this.notificationsRepository.insert(notification);
            return true;
        }
        catch (error) {
            this.logger.error('Failed To Create Follow', error);
            return false;
        }
    }
    async findAll(userName) {
        return await this.notificationsRepository.find({
            where: { userName },
            order: { createdAt: 'DESC' }
        });
    }
};
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        actor_object_service_1.ActorObjectService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
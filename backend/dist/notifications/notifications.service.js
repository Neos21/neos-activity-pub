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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const actor_object_service_1 = require("../shared/services/actor-object.service");
const notification_1 = require("../entities/notification");
let NotificationsService = exports.NotificationsService = class NotificationsService {
    constructor(notificationsRepository, actorObjectSerice) {
        this.notificationsRepository = notificationsRepository;
        this.actorObjectSerice = actorObjectSerice;
    }
    createFollow(userName, actorObject) {
        const notification = new notification_1.Notification({
            userName: userName,
            type: 'follow',
            actorName: this.actorObjectSerice.getActorUserName(actorObject),
            remoteHost: this.actorObjectSerice.getRemoteHost(actorObject)
        });
        return this.notificationsRepository.insert(notification).then(_insertResult => true).catch(_error => false);
    }
    findAll(userName) {
        return this.notificationsRepository.find({
            where: { userName },
            order: { createdAt: 'DESC' }
        });
    }
};
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        actor_object_service_1.ActorObjectService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
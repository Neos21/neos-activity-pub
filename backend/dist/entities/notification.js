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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
let Notification = exports.Notification = class Notification {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'user_name' }),
    __metadata("design:type", String)
], Notification.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'type' }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'actor_name' }),
    __metadata("design:type", String)
], Notification.prototype, "actorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'remote_host', nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "remoteHost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'post_id', nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    __metadata("design:paramtypes", [Object])
], Notification);
//# sourceMappingURL=notification.js.map
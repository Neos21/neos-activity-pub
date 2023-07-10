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
exports.ActorObjectService = void 0;
const common_1 = require("@nestjs/common");
const host_url_service_1 = require("./host-url.service");
let ActorObjectService = exports.ActorObjectService = class ActorObjectService {
    constructor(hostUrlService) {
        this.hostUrlService = hostUrlService;
    }
    getRemoteHost(actorObject) {
        const targetHost = new URL(actorObject.url).host;
        if (this.hostUrlService.host === targetHost)
            return undefined;
        return targetHost;
    }
    getActorUserName(actorObject) {
        return actorObject.preferredUsername;
    }
    getFullName(actorObject) {
        const remoteHost = this.getRemoteHost(actorObject);
        const actorUserName = this.getActorUserName(actorObject);
        if (remoteHost == null)
            return actorUserName;
        return `${actorUserName}@${remoteHost}`;
    }
};
exports.ActorObjectService = ActorObjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [host_url_service_1.HostUrlService])
], ActorObjectService);
//# sourceMappingURL=actor-object.service.js.map
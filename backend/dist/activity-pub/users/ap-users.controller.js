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
exports.APUsersController = void 0;
const common_1 = require("@nestjs/common");
const host_url_service_1 = require("../../shared/services/host-url.service");
const users_service_1 = require("../../users/users.service");
let APUsersController = exports.APUsersController = class APUsersController {
    constructor(hostUrlService, usersService) {
        this.hostUrlService = hostUrlService;
        this.usersService = usersService;
    }
    async getUser(name, res) {
        const user = await this.usersService.findOneWithPublicKey(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).send(`User [${name}] is not found.`);
        const fqdn = this.hostUrlService.fqdn;
        const json = {
            '@context': [
                'https://www.w3.org/ns/activitystreams',
                'https://w3id.org/security/v1'
            ],
            type: 'Person',
            id: `${fqdn}/api/activity-pub/users/${user.name}`,
            name: user.name,
            preferredUsername: user.name,
            summary: `<p>User : ${user.name}</p>`,
            inbox: `${fqdn}/api/activity-pub/users/${user.name}/inbox`,
            outbox: `${fqdn}/api/activity-pub/users/${user.name}/outbox`,
            url: `${fqdn}/api/activity-pub/users/${user.name}`,
            manuallyApprovesFollowers: false,
            discoverable: true,
            published: `${user.createdAt.toISOString().slice(0, 10)}T00:00:00Z`,
            publicKey: {
                id: `${fqdn}/api/activity-pub/users/${user.name}#main-key`,
                owner: `${fqdn}/api/activity-pub/users/${user.name}`,
                publicKeyPem: user.publicKey
            },
            tag: [],
            attachment: [],
            icon: {
                type: 'Image',
                mediaType: 'image/jpeg',
                url: `${fqdn}/assets/icon.jpg`
            },
            image: {
                type: 'Image',
                mediaType: 'image/jpeg',
                url: `${fqdn}/assets/icon.jpg`
            }
        };
        return res.status(common_1.HttpStatus.OK).type('application/activity+json').json(json);
    }
};
__decorate([
    (0, common_1.Get)(':name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], APUsersController.prototype, "getUser", null);
exports.APUsersController = APUsersController = __decorate([
    (0, common_1.Controller)('api/activity-pub/users'),
    __metadata("design:paramtypes", [host_url_service_1.HostUrlService,
        users_service_1.UsersService])
], APUsersController);
//# sourceMappingURL=ap-users.controller.js.map
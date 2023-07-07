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
exports.ActivityPubController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let ActivityPubController = exports.ActivityPubController = class ActivityPubController {
    constructor(configService, usersService) {
        this.configService = configService;
        this.usersService = usersService;
    }
    async getUser(name, res) {
        const isHttp = this.configService.get('isHttp');
        const host = this.configService.get('host');
        const domain = `http${isHttp ? '' : 's'}://${host}`;
        const user = await this.usersService.findOneWithPublicKey(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).send(`User [${name}] is not found.`);
        const json = {
            '@context': [
                'https://www.w3.org/ns/activitystreams',
                'https://w3id.org/security/v1'
            ],
            type: 'Person',
            id: `${domain}/api/activity-pub/users${user.name}`,
            name: user.name,
            preferredUsername: user.name,
            summary: `<p>User : ${user.name}</p>`,
            inbox: `${domain}/api/activity-pub/users/${user.name}/inbox`,
            outbox: `${domain}/api/activity-pub/users/${user.name}/outbox`,
            url: `${domain}/api/activity-pub/users/${user.name}`,
            manuallyApprovesFollowers: false,
            discoverable: true,
            published: '2023-07-07T00:00:00Z',
            publicKey: {
                id: `${domain}/api/activity-pub/users/${user.name}#main-key`,
                owner: `${domain}/api/activity-pub/users/${user.name}`,
                publicKeyPem: user.publicKey
            },
            tag: [],
            attachment: [],
            icon: {
                type: 'Image',
                mediaType: 'image/jpeg',
                url: `${domain}/assets/icon.jpg`
            },
            image: {
                type: 'Image',
                mediaType: 'image/jpeg',
                url: `${domain}/assets/icon.jpg`
            }
        };
        return res.status(common_1.HttpStatus.OK).type('application/activity+json').json(json);
    }
};
__decorate([
    (0, common_1.Get)('users/:name'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ActivityPubController.prototype, "getUser", null);
exports.ActivityPubController = ActivityPubController = __decorate([
    (0, common_1.Controller)('api/activity-pub'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], ActivityPubController);
//# sourceMappingURL=activity-pub.controller.js.map
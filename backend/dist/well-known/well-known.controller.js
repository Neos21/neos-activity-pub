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
exports.WellKnownController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let WellKnownController = exports.WellKnownController = class WellKnownController {
    constructor(configService, usersService) {
        this.configService = configService;
        this.usersService = usersService;
    }
    getHostMeta(res) {
        const host = this.configService.get('host');
        const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
            + '<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">\n'
            + '  <Link rel="lrdd" template="https://' + host + '/.well-known/webfinger?resource={uri}"/>\n'
            + '</XRD>\n';
        return res.status(common_1.HttpStatus.OK).type('application/xrd+xml').send(xml);
    }
    async getWebFinger(resource, res) {
        if (resource == null || !resource.startsWith('acct:'))
            return res.status(common_1.HttpStatus.BAD_REQUEST).send('Bad request. Please make sure "acct:USER@DOMAIN" is what you are sending as the "resource" query parameter.');
        const isHttp = this.configService.get('isHttp');
        const host = this.configService.get('host');
        const domain = `http${isHttp ? '' : 's'}://${host}`;
        const name = resource.replace('acct:', '').replace(`@${host}`, '');
        const user = await this.usersService.findOne(name);
        if (user == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).send(`Actor [${resource}] is not found.`);
        const json = {
            subject: `acct:${user.name}@${host}`,
            aliases: [
                `${domain}/api/activity-pub/users/${user.name}`
            ],
            links: [
                {
                    rel: 'self',
                    type: 'application/activity+json',
                    href: `${domain}/api/activity-pub/users/${user.name}`
                },
                {
                    rel: 'http://webfinger.net/rel/profile-page',
                    type: 'text/html',
                    href: `${domain}/@${name}`
                },
                {
                    rel: 'http://ostatus.org/schema/1.0/subscribe',
                    template: `${domain}/authorize-follow?uri={uri}`
                }
            ]
        };
        return res.status(common_1.HttpStatus.OK).type('application/jrd+json').json(json);
    }
};
__decorate([
    (0, common_1.Get)('host-meta'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], WellKnownController.prototype, "getHostMeta", null);
__decorate([
    (0, common_1.Get)('webfinger'),
    __param(0, (0, common_1.Query)('resource')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WellKnownController.prototype, "getWebFinger", null);
exports.WellKnownController = WellKnownController = __decorate([
    (0, common_1.Controller)('.well-known'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], WellKnownController);
//# sourceMappingURL=well-known.controller.js.map
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
exports.SignHeaderService = void 0;
const crypto = require("node:crypto");
const common_1 = require("@nestjs/common");
const host_url_service_1 = require("../shared/services/host-url.service");
let SignHeaderService = exports.SignHeaderService = class SignHeaderService {
    constructor(hostUrlService) {
        this.hostUrlService = hostUrlService;
    }
    signHeader(json, inboxUrl, userName, privateKey) {
        const utc = new Date().toUTCString();
        const sha256Digest = 'SHA-256=' + crypto.createHash('sha256').update(JSON.stringify(json)).digest('base64');
        const hostName = new URL(inboxUrl).hostname;
        const signature = crypto.createSign('sha256').update([
            `(request-target): post ${new URL(inboxUrl).pathname}`,
            `host: ${hostName}`,
            `date: ${utc}`,
            `digest: ${sha256Digest}`
        ].join('\n')).end();
        const base64Signature = signature.sign(privateKey, 'base64');
        const requestHeaders = {
            Host: hostName,
            Date: utc,
            Digest: sha256Digest,
            Signature: [
                `keyId="${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}#main-key"`,
                'algorithm="rsa-sha256"',
                'headers="(request-target) host date digest"',
                `signature="${base64Signature}"`
            ].join(','),
            Accept: 'application/activity+json',
            'Content-Type': 'application/activity+json'
        };
        return requestHeaders;
    }
};
exports.SignHeaderService = SignHeaderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [host_url_service_1.HostUrlService])
], SignHeaderService);
//# sourceMappingURL=sign-header.service.js.map
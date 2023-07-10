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
exports.HostUrlService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let HostUrlService = exports.HostUrlService = class HostUrlService {
    constructor(configService) {
        this.configService = configService;
        this.host = this.configService.get('host');
        this.isHttp = this.configService.get('isHttp');
        this.fqdn = `http${this.isHttp ? '' : 's'}://${this.host}`;
    }
};
exports.HostUrlService = HostUrlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HostUrlService);
//# sourceMappingURL=host-url.service.js.map
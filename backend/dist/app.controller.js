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
exports.AppController = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let AppController = exports.AppController = class AppController {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async test(res) {
        const result = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://mstdn.jp/@Neos21mstdn/110708815749404953', {
            headers: {
                Accept: 'application/activity+json',
                'Content-Type': 'application/activity+json'
            }
        }));
        console.log(result);
        return res.status(common_1.HttpStatus.OK).send('OK');
    }
};
__decorate([
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "test", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AppController);
//# sourceMappingURL=app.controller.js.map
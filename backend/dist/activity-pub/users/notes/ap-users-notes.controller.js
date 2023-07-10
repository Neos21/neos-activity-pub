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
exports.APUsersNotesController = void 0;
const common_1 = require("@nestjs/common");
const host_url_service_1 = require("../../../shared/services/host-url.service");
let APUsersNotesController = exports.APUsersNotesController = class APUsersNotesController {
    constructor(hostUrlService) {
        this.hostUrlService = hostUrlService;
    }
    getNote(name, id, res) {
        const fqdn = this.hostUrlService.fqdn;
        const json = {
            '@context': 'https://www.w3.org/ns/activitystreams',
            type: 'Note',
            id: `${fqdn}/api/activity-pub/users/${name}/notes/${id}`,
            attributedTo: `${fqdn}/api/activity-pub/users/${name}`,
            content: `<p>仮投稿 ${name} ${id}</p>`,
            published: '2023-07-07T00:00:00+09:00',
            to: [
                'https://www.w3.org/ns/activitystreams#Public',
                `${fqdn}/api/activity-pub/users/${name}/followers`,
            ]
        };
        return res.status(common_1.HttpStatus.OK).type('application/activity+json').json(json);
    }
};
__decorate([
    (0, common_1.Get)(':name/notes/:id'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Object)
], APUsersNotesController.prototype, "getNote", null);
exports.APUsersNotesController = APUsersNotesController = __decorate([
    (0, common_1.Controller)('api/activity-pub/users'),
    __metadata("design:paramtypes", [host_url_service_1.HostUrlService])
], APUsersNotesController);
//# sourceMappingURL=ap-users-notes.controller.js.map
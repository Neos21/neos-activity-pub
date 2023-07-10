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
exports.FollowersController = void 0;
const common_1 = require("@nestjs/common");
const followers_service_1 = require("./followers.service");
const users_service_1 = require("../users.service");
let FollowersController = exports.FollowersController = class FollowersController {
    constructor(followersService, usersService) {
        this.followersService = followersService;
        this.usersService = usersService;
    }
    async findAll(name, res) {
        try {
            const user = this.usersService.findOne(name);
            if (user == null)
                return res.status(common_1.HttpStatus.NOT_FOUND).json({ error: 'User Not Found' });
            const followers = await this.followersService.findAll(name);
            return res.status(common_1.HttpStatus.OK).json(followers);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
};
__decorate([
    (0, common_1.Get)(':name/followers'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FollowersController.prototype, "findAll", null);
exports.FollowersController = FollowersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [followers_service_1.FollowersService,
        users_service_1.UsersService])
], FollowersController);
//# sourceMappingURL=followers.controller.js.map
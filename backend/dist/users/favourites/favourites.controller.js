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
exports.FavouritesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const favourites_service_1 = require("./favourites.service");
let FavouritesController = exports.FavouritesController = class FavouritesController {
    constructor(favouritesService) {
        this.favouritesService = favouritesService;
    }
    async create(name, userName, postId, userId, req, res) {
        const jwtUserName = req.user?.name;
        if (jwtUserName == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
        if (name !== userName || name !== jwtUserName || userName !== jwtUserName)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
        try {
            const inboxUrl = await this.favouritesService.fetchInboxUrl(userId);
            await this.favouritesService.postLikeInbox(userName, inboxUrl, postId);
            await this.favouritesService.create(userName, postId, inboxUrl);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async findOne(name, postId, res) {
        const favourite = await this.favouritesService.findOne(name, postId);
        if (favourite == null)
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ error: 'Like Not Found' });
        return res.status(common_1.HttpStatus.OK).json(favourite);
    }
    async remove(name, postId, req, res) {
        const jwtUserName = req.user?.name;
        if (jwtUserName == null)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
        if (name !== jwtUserName)
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
        try {
            const favourite = await this.favouritesService.findOne(name, postId);
            if (favourite == null)
                return res.status(common_1.HttpStatus.NOT_FOUND).json({ error: 'Favourite Not Found' });
            await this.favouritesService.postUnlikeInbox(name, favourite.inboxUrl, postId);
            await this.favouritesService.remove(name, postId);
            return res.status(common_1.HttpStatus.OK).end();
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':name/favourites'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)('userName')),
    __param(2, (0, common_1.Body)('postId')),
    __param(3, (0, common_1.Body)('userId')),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FavouritesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':name/favourites/:postId'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FavouritesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':name/favourites/:postId'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FavouritesController.prototype, "remove", null);
exports.FavouritesController = FavouritesController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [favourites_service_1.FavouritesService])
], FavouritesController);
//# sourceMappingURL=favourites.controller.js.map
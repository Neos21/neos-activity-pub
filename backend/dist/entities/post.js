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
exports.Post = void 0;
const typeorm_1 = require("typeorm");
let Post = exports.Post = class Post {
    constructor(partial) { Object.assign(this, partial); }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'user_name' }),
    __metadata("design:type", String)
], Post.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
exports.Post = Post = __decorate([
    (0, typeorm_1.Entity)('posts'),
    __metadata("design:paramtypes", [Object])
], Post);
//# sourceMappingURL=post.js.map
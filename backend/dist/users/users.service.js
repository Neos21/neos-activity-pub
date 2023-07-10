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
exports.UsersService = void 0;
const crypto = require("node:crypto");
const util = require("node:util");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcryptjs = require("bcryptjs");
const user_1 = require("../entities/user");
const generateKeyPairAsync = util.promisify(crypto.generateKeyPair);
let UsersService = exports.UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(user) {
        if (!(/^[a-z0-9-]+$/u).test(user.name))
            throw new Error('Invalid User Name');
        if (user.password === '')
            throw new Error('Invalid Password');
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(user.password, salt);
        user.password = hash;
        const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
        user.publicKey = publicKey;
        user.privateKey = privateKey;
        await this.usersRepository.insert(user);
        return true;
    }
    async findOne(name) {
        return this.findOneBase(name, { name: true, createdAt: true });
    }
    async findOneWithPassword(name) {
        return this.findOneBase(name, { name: true, password: true });
    }
    async findOneWithPublicKey(name) {
        return this.findOneBase(name, { name: true, createdAt: true, publicKey: true });
    }
    async findOneWithPrivateKey(name) {
        return this.findOneBase(name, { name: true, privateKey: true });
    }
    async findOneBase(name, selectOptions) {
        return this.usersRepository.findOne({
            select: selectOptions,
            where: { name }
        });
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map
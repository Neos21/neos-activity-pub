"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AccessLogMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLogMiddleware = void 0;
const common_1 = require("@nestjs/common");
const colour_logger_1 = require("./utils/colour-logger");
let AccessLogMiddleware = exports.AccessLogMiddleware = AccessLogMiddleware_1 = class AccessLogMiddleware {
    constructor() {
        this.logger = new common_1.Logger(AccessLogMiddleware_1.name);
    }
    use(req, _res, next) {
        this.logger.log((0, colour_logger_1.yellow)(`[${req.method}]`) + ' ' + (0, colour_logger_1.cyan)(`[${req.baseUrl}]`) + this.stringifyParam('Query', req.query) + this.stringifyParam('Body', req.body));
        next();
    }
    stringifyParam(name, param) {
        try {
            const parsedParam = param != null ? JSON.stringify(param) : '';
            return ['', '{}'].includes(parsedParam) ? '' : ` ${name}:${parsedParam}`;
        }
        catch (_error) {
            return '';
        }
    }
};
exports.AccessLogMiddleware = AccessLogMiddleware = AccessLogMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], AccessLogMiddleware);
//# sourceMappingURL=access-log.middleware.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const express = require("express");
const colour_logger_1 = require("./core/utils/colour-logger");
const list_routes_1 = require("./core/utils/list-routes");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger(bootstrap.name);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(express.json({
        type: ['application/activity+json', 'application/json']
    }));
    app.enableCors({
        origin: (/localhost/),
        methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Credentials',
        credentials: true
    });
    const port = app.get(config_1.ConfigService).get('port');
    await app.listen(port);
    logger.log((0, colour_logger_1.cyan)(`Server started at port [`) + (0, colour_logger_1.yellow)(`${port}`) + (0, colour_logger_1.cyan)(']'));
    const router = app.getHttpServer()._events.request._router;
    logger.log((0, list_routes_1.listRoutes)(router));
}
void bootstrap();
//# sourceMappingURL=main.js.map
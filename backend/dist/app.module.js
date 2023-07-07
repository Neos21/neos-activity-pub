"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path = require("node:path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const serve_static_1 = require("@nestjs/serve-static");
const configuration_1 = require("./common/configuration");
const access_log_middleware_1 = require("./common/access-log.middleware");
const user_1 = require("./entities/user");
const activity_pub_controller_1 = require("./activity-pub/activity-pub.controller");
const inbox_controller_1 = require("./activity-pub/inbox.controller");
const outbox_controller_1 = require("./activity-pub/outbox.controller");
const auth_controller_1 = require("./auth/auth.controller");
const users_controller_1 = require("./users/users.controller");
const well_known_controller_1 = require("./well-known/well-known.controller");
const app_controller_1 = require("./app.controller");
const users_service_1 = require("./users/users.service");
let AppModule = exports.AppModule = class AppModule {
    configure(middlewareConsumer) {
        middlewareConsumer.apply(access_log_middleware_1.AccessLogMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.configuration]
            }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('jwtSecret'),
                    signOptions: { expiresIn: '1y' }
                })
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'sqlite',
                    database: path.resolve(__dirname, '../db/neos-activity-pub-backend.sqlite3.db'),
                    entities: [
                        user_1.User
                    ],
                    synchronize: true
                })
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_1.User
            ]),
            serve_static_1.ServeStaticModule.forRootAsync({
                useFactory: () => [{
                        rootPath: path.resolve(__dirname, '../../frontend/dist')
                    }]
            })
        ],
        controllers: [
            activity_pub_controller_1.ActivityPubController,
            inbox_controller_1.InboxController,
            outbox_controller_1.OutboxController,
            auth_controller_1.AuthController,
            users_controller_1.UsersController,
            well_known_controller_1.WellKnownController,
            app_controller_1.AppController
        ],
        providers: [
            users_service_1.UsersService
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
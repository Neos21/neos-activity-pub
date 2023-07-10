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
const axios_1 = require("@nestjs/axios");
const configuration_1 = require("./core/configuration");
const access_log_middleware_1 = require("./core/access-log.middleware");
const user_1 = require("./entities/user");
const post_1 = require("./entities/post");
const follower_1 = require("./entities/follower");
const notification_1 = require("./entities/notification");
const ap_users_controller_1 = require("./activity-pub/users/ap-users.controller");
const ap_users_inbox_controller_1 = require("./activity-pub/users/inbox/ap-users-inbox.controller");
const ap_users_outbox_controller_1 = require("./activity-pub/users/outbox/ap-users-outbox.controller");
const auth_controller_1 = require("./auth/auth.controller");
const users_controller_1 = require("./users/users.controller");
const posts_controller_1 = require("./users/posts/posts.controller");
const well_known_controller_1 = require("./well-known/well-known.controller");
const app_controller_1 = require("./app.controller");
const host_url_service_1 = require("./shared/services/host-url.service");
const actor_object_service_1 = require("./shared/services/actor-object.service");
const users_service_1 = require("./users/users.service");
const followers_service_1 = require("./users/followers/followers.service");
const notifications_service_1 = require("./notifications/notifications.service");
const followers_controller_1 = require("./users/followers/followers.controller");
const notifications_controller_1 = require("./notifications/notifications.controller");
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
                        user_1.User,
                        post_1.Post,
                        follower_1.Follower,
                        notification_1.Notification
                    ],
                    synchronize: true
                })
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_1.User,
                post_1.Post,
                follower_1.Follower,
                notification_1.Notification
            ]),
            serve_static_1.ServeStaticModule.forRootAsync({
                useFactory: () => [{
                        rootPath: path.resolve(__dirname, '../../frontend/dist')
                    }]
            }),
            axios_1.HttpModule
        ],
        controllers: [
            ap_users_controller_1.APUsersController,
            ap_users_inbox_controller_1.APUsersInboxController,
            ap_users_outbox_controller_1.APUsersOutboxController,
            auth_controller_1.AuthController,
            users_controller_1.UsersController,
            posts_controller_1.PostsController,
            well_known_controller_1.WellKnownController,
            app_controller_1.AppController,
            followers_controller_1.FollowersController,
            notifications_controller_1.NotificationsController
        ],
        providers: [
            host_url_service_1.HostUrlService,
            actor_object_service_1.ActorObjectService,
            users_service_1.UsersService,
            followers_service_1.FollowersService,
            notifications_service_1.NotificationsService
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
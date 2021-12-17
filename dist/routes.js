"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_v1_1 = __importDefault(require("./Auth/auth.route.v1"));
const swagger_route_1 = __importDefault(require("./swagger/swagger.route"));
const user_route_v1_1 = __importDefault(require("./Users/user.route.v1"));
const config_1 = __importDefault(require("./config/config"));
const router = express_1.default.Router();
const defaultIRoute = [
    {
        path: '/auth',
        route: auth_route_v1_1.default,
    },
    {
        path: '/users',
        route: user_route_v1_1.default,
    },
];
const devIRoute = [
    // IRoute available only in development mode
    {
        path: '/docs',
        route: swagger_route_1.default,
    },
];
defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config_1.default.env === 'development') {
    devIRoute.forEach((route) => {
        router.use(route.path, route.route);
    });
}
exports.default = router;

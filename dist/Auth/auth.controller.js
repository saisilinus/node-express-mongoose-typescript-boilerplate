"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailController = exports.sendVerificationEmailController = exports.resetPasswordController = exports.forgotPasswordController = exports.refreshTokensController = exports.logoutController = exports.loginController = exports.registerController = exports.sendTokens = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_service_1 = require("../Users/user.service");
const token_service_1 = require("../Tokens/token.service");
const auth_service_1 = require("./auth.service");
const email_service_1 = require("../Email/email.service");
const config_1 = __importDefault(require("../config/config"));
const sendTokens = (res, tokens) => {
    res.cookie('accessToken', tokens.access, config_1.default.jwt.cookieOptions);
    res.cookie('refreshToken', tokens.refresh, config_1.default.jwt.cookieOptions);
};
exports.sendTokens = sendTokens;
exports.registerController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.createUser)(req.body);
    const tokens = yield (0, token_service_1.generateAuthTokens)(user);
    const verifyEmailToken = yield (0, token_service_1.generateVerifyEmailToken)(user);
    yield (0, email_service_1.sendSuccessfulRegistration)(user.email, verifyEmailToken, user.name);
    (0, exports.sendTokens)(res, tokens);
    res.status(http_status_1.default.CREATED).send({ user });
}));
exports.loginController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, auth_service_1.loginUserWithEmailAndPassword)(email, password);
    const tokens = yield (0, token_service_1.generateAuthTokens)(user);
    (0, exports.sendTokens)(res, tokens);
    res.send({ user });
}));
exports.logoutController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.logout)(req.cookies.refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.refreshTokensController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield (0, auth_service_1.refreshAuth)(req.cookies.refreshToken);
    (0, exports.sendTokens)(res, tokens);
    res.status(http_status_1.default.OK).send();
}));
exports.forgotPasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = yield (0, token_service_1.generateResetPasswordToken)(req.body.email);
    yield (0, email_service_1.sendResetPasswordEmail)(req.body.email, resetPasswordToken);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.resetPasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.resetPassword)(req.cookies.resetPasswordToken, req.body.password);
    res.clearCookie('resetPasswordToken');
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.sendVerificationEmailController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyEmailToken = yield (0, token_service_1.generateVerifyEmailToken)(req.user);
    yield (0, email_service_1.sendVerificationEmail)(req.user.email, verifyEmailToken, req.user.name);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.verifyEmailController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_service_1.verifyEmail)(req.cookies.verifyEmailToken);
    if (user) {
        yield (0, email_service_1.sendAccountCreated)(user.email, user.name);
    }
    res.clearCookie('verifyEmailToken');
    res.status(http_status_1.default.NO_CONTENT).send();
}));

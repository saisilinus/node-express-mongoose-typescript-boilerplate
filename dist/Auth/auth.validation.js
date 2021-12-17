"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailValidator = exports.resetPasswordValidator = exports.forgotPasswordValidator = exports.refreshTokensValidator = exports.logoutValidator = exports.loginValidator = exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../utils/custom.validation");
const registerBody = {
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required().custom(custom_validation_1.password),
    name: joi_1.default.string().required(),
};
exports.registerValidator = {
    body: joi_1.default.object().keys(registerBody),
};
exports.loginValidator = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
};
exports.logoutValidator = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.refreshTokensValidator = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.forgotPasswordValidator = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    }),
};
exports.resetPasswordValidator = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
    body: joi_1.default.object().keys({
        password: joi_1.default.string().required().custom(custom_validation_1.password),
    }),
};
exports.verifyEmailValidator = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserValidator = exports.updateUserValidator = exports.getUserValidator = exports.getUsersValidator = exports.createUserValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../utils/custom.validation");
const createUserBody = {
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required().custom(custom_validation_1.password),
    name: joi_1.default.string().required(),
    role: joi_1.default.string().required().valid('user', 'admin'),
};
exports.createUserValidator = {
    body: joi_1.default.object().keys(createUserBody),
};
exports.getUsersValidator = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getUserValidator = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.updateUserValidator = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        email: joi_1.default.string().email(),
        password: joi_1.default.string().custom(custom_validation_1.password),
        name: joi_1.default.string(),
    })
        .min(1),
};
exports.deleteUserValidator = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
const config_1 = __importDefault(require("../config/config"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'node-express-typescript-boilerplate API documentation',
        version: package_json_1.version,
        license: {
            name: 'MIT',
            url: 'https://github.com/saisilinus/node-express-mongoose-typescript-boilerplate.git',
        },
    },
    servers: [
        {
            url: `http://localhost:${config_1.default.port}/v1`,
        },
    ],
};
exports.default = swaggerDefinition;

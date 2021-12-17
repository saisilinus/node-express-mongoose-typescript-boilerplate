"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_definition_1 = __importDefault(require("./swagger.definition"));
const router = express_1.default.Router();
const specs = (0, swagger_jsdoc_1.default)({
    swaggerDefinition: swagger_definition_1.default,
    apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
});
router.use('/', swagger_ui_express_1.default.serve);
router.get('/', swagger_ui_express_1.default.setup(specs, {
    explorer: true,
}));
exports.default = router;

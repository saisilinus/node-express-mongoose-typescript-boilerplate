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
exports.deleteUserController = exports.updateUserController = exports.getUserController = exports.getUsersController = exports.createUserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const pick_1 = __importDefault(require("../utils/pick"));
const user_service_1 = require("./user.service");
exports.createUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.createUser)(req.body);
    res.status(http_status_1.default.CREATED).send(user);
}));
exports.getUsersController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, ['name', 'role']);
    const options = (0, pick_1.default)(req.query, ['sortBy', 'limit', 'page']);
    const result = yield (0, user_service_1.queryUsers)(filter, options);
    res.send(result);
}));
exports.getUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['userId'] === 'string') {
        const user = yield (0, user_service_1.getUserById)(new mongoose_1.default.Schema.Types.ObjectId(req.params['userId']));
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        res.send(user);
    }
}));
exports.updateUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['userId'] === 'string') {
        const user = yield (0, user_service_1.updateUserById)(new mongoose_1.default.Schema.Types.ObjectId(req.params['userId']), req.body);
        res.send(user);
    }
}));
exports.deleteUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['userId'] === 'string') {
        yield (0, user_service_1.deleteUserById)(new mongoose_1.default.Schema.Types.ObjectId(req.params['userId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));

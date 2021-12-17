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
exports.deleteUserById = exports.updateUserById = exports.getUserByEmail = exports.getUserById = exports.queryUsers = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("./user.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
const createUser = (userBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield user_model_1.default.isEmailTaken(userBody.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    return user_model_1.default.create(userBody);
});
exports.createUser = createUser;
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.paginate(filter, options);
    return users;
});
exports.queryUsers = queryUsers;
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findById(id);
});
exports.getUserById = getUserById;
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findOne({ email });
});
exports.getUserByEmail = getUserByEmail;
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
const updateUserById = (userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (yield user_model_1.default.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    yield user.save();
    return user;
});
exports.updateUserById = updateUserById;
/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield user.remove();
    return user;
});
exports.deleteUserById = deleteUserById;

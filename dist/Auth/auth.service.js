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
exports.verifyEmail = exports.resetPassword = exports.refreshAuth = exports.logout = exports.loginUserWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const token_model_1 = __importDefault(require("../Tokens/token.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const token_types_1 = __importDefault(require("../Tokens/token.types"));
const user_service_1 = require("../Users/user.service");
const token_service_1 = require("../Tokens/token.service");
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
const loginUserWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user || !(yield user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
});
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenDoc = yield token_model_1.default.findOne({ token: refreshToken, type: token_types_1.default.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found');
    }
    yield refreshTokenDoc.remove();
});
exports.logout = logout;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AccessAndRefreshTokens>}
 */
const refreshAuth = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTokenDoc = yield (0, token_service_1.verifyToken)(refreshToken, token_types_1.default.REFRESH);
        const user = yield (0, user_service_1.getUserById)(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        yield refreshTokenDoc.remove();
        return yield (0, token_service_1.generateAuthTokens)(user);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
});
exports.refreshAuth = refreshAuth;
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = (resetPasswordToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetPasswordTokenDoc = yield (0, token_service_1.verifyToken)(resetPasswordToken, token_types_1.default.RESET_PASSWORD);
        const user = yield (0, user_service_1.getUserById)(resetPasswordTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        yield (0, user_service_1.updateUserById)(user.id, { password: newPassword });
        yield token_model_1.default.deleteMany({ user: user.id, type: token_types_1.default.RESET_PASSWORD });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
});
exports.resetPassword = resetPassword;
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
const verifyEmail = (verifyEmailToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyEmailTokenDoc = yield (0, token_service_1.verifyToken)(verifyEmailToken, token_types_1.default.VERIFY_EMAIL);
        const user = yield (0, user_service_1.getUserById)(verifyEmailTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        yield token_model_1.default.deleteMany({ user: user.id, type: token_types_1.default.VERIFY_EMAIL });
        const updatedUser = yield (0, user_service_1.updateUserById)(user.id, { isEmailVerified: true });
        return updatedUser;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email verification failed');
    }
});
exports.verifyEmail = verifyEmail;

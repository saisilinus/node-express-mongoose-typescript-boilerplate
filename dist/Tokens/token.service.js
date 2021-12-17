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
exports.generateVerifyEmailToken = exports.generateResetPasswordToken = exports.generateAuthTokens = exports.verifyToken = exports.saveToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config/config"));
const token_model_1 = __importDefault(require("./token.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const token_types_1 = __importDefault(require("./token.types"));
const user_service_1 = require("../Users/user.service");
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config_1.default.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
const saveToken = (token, userId, expires, type, blacklisted = false) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield token_model_1.default.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
});
exports.saveToken = saveToken;
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    let tokenDoc;
    if (typeof payload.sub === 'string') {
        tokenDoc = yield token_model_1.default.findOne({
            token,
            type,
            user: new mongoose_1.default.Schema.Types.ObjectId(payload.sub),
            blacklisted: false,
        });
    }
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
});
exports.verifyToken = verifyToken;
/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = (0, exports.generateToken)(user.id, accessTokenExpires, token_types_1.default.ACCESS);
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
    const refreshToken = (0, exports.generateToken)(user.id, refreshTokenExpires, token_types_1.default.REFRESH);
    yield (0, exports.saveToken)(refreshToken, user.id, refreshTokenExpires, token_types_1.default.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
});
exports.generateAuthTokens = generateAuthTokens;
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No users found with this email');
    }
    const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = (0, exports.generateToken)(user.id, expires, token_types_1.default.RESET_PASSWORD);
    yield (0, exports.saveToken)(resetPasswordToken, user.id, expires, token_types_1.default.RESET_PASSWORD);
    return resetPasswordToken;
});
exports.generateResetPasswordToken = generateResetPasswordToken;
/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = (0, exports.generateToken)(user.id, expires, token_types_1.default.VERIFY_EMAIL);
    yield (0, exports.saveToken)(verifyEmailToken, user.id, expires, token_types_1.default.VERIFY_EMAIL);
    return verifyEmailToken;
});
exports.generateVerifyEmailToken = generateVerifyEmailToken;

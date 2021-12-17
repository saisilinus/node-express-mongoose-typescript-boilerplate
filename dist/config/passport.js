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
const passport_jwt_1 = require("passport-jwt");
const token_types_1 = __importDefault(require("../Tokens/token.types"));
const config_1 = __importDefault(require("./config"));
const user_model_1 = __importDefault(require("../Users/user.model"));
const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.accessToken;
    }
    return token;
};
const jwtOptions = {
    secretOrKey: config_1.default.jwt.secret,
    jwtFromRequest: cookieExtractor,
};
const jwtVerify = (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload.type !== token_types_1.default.ACCESS) {
            throw new Error('Invalid token type');
        }
        const user = yield user_model_1.default.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
});
const jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, jwtVerify);
exports.default = jwtStrategy;

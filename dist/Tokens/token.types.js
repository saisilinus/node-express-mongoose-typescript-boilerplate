"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensEnum = void 0;
exports.default = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail',
};
var TokensEnum;
(function (TokensEnum) {
    TokensEnum[TokensEnum["access"] = 0] = "access";
    TokensEnum[TokensEnum["refresh"] = 1] = "refresh";
    TokensEnum[TokensEnum["resetPassword"] = 2] = "resetPassword";
    TokensEnum[TokensEnum["verifyEmail"] = 3] = "verifyEmail";
})(TokensEnum = exports.TokensEnum || (exports.TokensEnum = {}));

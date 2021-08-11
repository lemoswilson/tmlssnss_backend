"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.comparePassword = exports.hashPassword = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const salt = yield bcryptjs_1.default.genSalt(10);
            return yield bcryptjs_1.default.hash(password, salt);
        }
        catch (erro) {
            throw new Error('hashing failed');
        }
    });
}
exports.hashPassword = hashPassword;
function comparePassword(inputPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield bcryptjs_1.default.compare(inputPassword, hashedPassword);
        }
        catch (error) {
            throw new Error('wrong password');
        }
    });
}
exports.comparePassword = comparePassword;
const UserSchema = new mongoose_1.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.password) {
                this.password = yield hashPassword(this.password);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.default = mongoose_1.default.model('UserModel', UserSchema);
//# sourceMappingURL=user.model.js.map
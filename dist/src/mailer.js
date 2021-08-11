"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'Hotmail',
    auth: {
        user: "tmlssnss@outlook.com",
        pass: '$ine$QUARE420'
    }
});
exports.options = {
    from: "tmlssnss@outlook.com",
    to: '',
    subject: "Recover your Tmlssnss password",
    text: '',
};
exports.default = transporter;
//# sourceMappingURL=mailer.js.map
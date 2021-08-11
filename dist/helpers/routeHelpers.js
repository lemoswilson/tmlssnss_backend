"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.makeid = exports.validateBody = exports.messages = void 0;
const joi_1 = __importDefault(require("joi"));
var messages;
(function (messages) {
    messages["USER_ALREADY_EXISTS"] = "An user is already registered with this email, please try again using other address";
    messages["PASSWORD_UPDATE"] = "Your password was updated";
    messages["ERROR_PASSWORD"] = "There was an error trying to update your password, please try again";
    messages["UNKNOWN_EMAIL"] = "There is no user registred under this email";
    messages["INVALID_RESET_LINK"] = "Invalid reset link";
    messages["UNKOWN_USER_PASSWORD"] = "The password entered is incorrect";
    messages["ERROR_SAVING_ORDER"] = "There was an error saving the order to users database";
    messages["ERROR_FETCHING_ORDER"] = "There was an error trying to fetch your orders";
})(messages = exports.messages || (exports.messages = {}));
function validateBody(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ error: validation.error.message });
        }
        req.body = Object.assign({}, validation.value);
        return next();
    };
}
exports.validateBody = validateBody;
function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
exports.makeid = makeid;
exports.schemas = {
    signUpSchema: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        first_name: joi_1.default.string().required().insensitive(),
        last_name: joi_1.default.string().required().insensitive(),
        password: joi_1.default.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
    }),
    updateSchema: joi_1.default.object().keys({
        old_password: joi_1.default.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
        password: joi_1.default.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
        confirmationPassword: joi_1.default.any().valid(joi_1.default.ref('password')).required(),
    }),
    passSchema: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
    }),
    resetPassword: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
        secret: joi_1.default.string().required().regex(/^(?=.{64}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
        confirmationPassword: joi_1.default.any().valid(joi_1.default.ref('password')).required(),
    })
};
//# sourceMappingURL=routeHelpers.js.map
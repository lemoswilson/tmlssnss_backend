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
exports.getOrders = exports.placeOrder = exports.resetPassword = exports.checkLink = exports.emailRecoverPassword = exports.updateUser = exports.signIn = exports.signUp = exports.verify = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const routeHelpers_1 = require("../helpers/routeHelpers");
const mailer_1 = __importStar(require("../src/mailer"));
const user_model_1 = __importStar(require("../models/user.model"));
const orders_model_1 = __importDefault(require("../models/orders.model"));
const routeHelpers_2 = require("../helpers/routeHelpers");
const user_model_2 = __importDefault(require("../models/user.model"));
const userRecover_model_1 = __importDefault(require("../models/userRecover.model"));
function signToken(user) {
    const token = jsonwebtoken_1.default.sign({
        iss: 'tmlssnss',
        sub: user._id,
        iat: new Date().getTime(),
        expo: new Date().setDate(new Date().getDate() + 1),
    }, process.env.JWT_AUTHORIZATION);
    return token;
}
exports.signToken = signToken;
function verify(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res.status(202).json({ data: 'invalid or expired token' });
            }
            else {
                const user = req.user;
                res.status(200).send({ data: true, name: user.first_name });
            }
        }
        catch (e) {
            res.status(403).send(e);
        }
    });
}
exports.verify = verify;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = Object.assign({}, req.body);
            const existence = yield user_model_1.default.findOne({ email: data.email }).exec();
            if (!existence) {
                const NewUser = new user_model_1.default(Object.assign({}, data));
                NewUser.save()
                    .then((user) => { res.status(200).json({ token: signToken(user._id), name: user.first_name }); })
                    .catch((err) => { res.send({ error: err }); });
            }
            else if (existence) {
                res.status(202).send({ error: routeHelpers_1.messages.USER_ALREADY_EXISTS });
            }
        }
        catch (err) {
            res.status(403).send(err);
        }
    });
}
exports.signUp = signUp;
;
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.user) {
                const token = signToken(req.user);
                res.status(200).json({ token, name: req.user.first_name });
            }
        }
        catch (_a) {
        }
    });
}
exports.signIn = signIn;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const User = req.user;
            const match = req.body.old_password && User && User.password ? yield user_model_1.comparePassword(req.body.old_password, User.password) : undefined;
            if (match && User && req.body.password) {
                User.password = req.body.password;
                User.save()
                    .then(_ => res.status(200).send({ message: routeHelpers_1.messages.PASSWORD_UPDATE }))
                    .catch(_ => res.send({ error: routeHelpers_1.messages.ERROR_PASSWORD }));
            }
        }
        catch (e) {
            res.status(402).json({ error: routeHelpers_1.messages.ERROR_PASSWORD });
        }
    });
}
exports.updateUser = updateUser;
function checkAndEmail(err, _, res, existence, pass) {
    if (err) {
        res.send({ error: 'there was an error while trying to send you an email, please try again later' });
    }
    else {
        mailer_1.default.sendMail(Object.assign(Object.assign({}, mailer_1.options), { text: `Reset your password by visiting ${process.env.REACT_APP_URL}/reset?mail=${existence === null || existence === void 0 ? void 0 : existence.email}&rcp=${pass}`, to: existence === null || existence === void 0 ? void 0 : existence.email }));
        res.status(200).send({ data: 'An email has been sent to you' });
    }
}
function emailRecoverPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existence = yield user_model_2.default.findOne({ email: req.body.email }).exec();
            if (existence) {
                const exist_rec = yield userRecover_model_1.default.findOne({ user: existence._id }).exec();
                const password = routeHelpers_2.makeid(65);
                const timeout = Date.now() + (60 * 45 * 1000);
                if (exist_rec) {
                    exist_rec.password = password;
                    exist_rec.timeout = timeout;
                    exist_rec.save()
                        .then(_ => {
                        checkAndEmail(undefined, undefined, res, existence, password);
                    })
                        .catch(e => {
                        checkAndEmail(e, undefined, res, existence, password);
                    });
                }
                else {
                    const newUser = new userRecover_model_1.default({ user: existence._id, password, timeout });
                    newUser.save()
                        .then(_ => {
                        checkAndEmail(undefined, undefined, res, existence, password);
                    })
                        .catch(e => {
                        checkAndEmail(e, undefined, res, existence, password);
                    });
                }
            }
            else {
                res.status(202).send({ error: routeHelpers_1.messages.UNKNOWN_EMAIL });
            }
        }
        catch (e) {
            res.status(403).send(e);
        }
    });
}
exports.emailRecoverPassword = emailRecoverPassword;
function checkLink(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, rcp } = req.body;
            const User = yield user_model_1.default.findOne({ email }).exec();
            if (User) {
                const existence = yield userRecover_model_1.default.findOne({ user: User._id, password: rcp }).exec();
                if (existence) {
                    const now = Date.now();
                    if (now < existence.timeout) {
                        res.status(200).send({ data: 'allowed' });
                    }
                    else {
                        res.status(202).send({ error: 'expired link' });
                    }
                }
                else {
                    res.status(202).json({ error: routeHelpers_1.messages.INVALID_RESET_LINK });
                }
            }
        }
        catch (e) {
            res.status(202).send(e);
        }
    });
}
exports.checkLink = checkLink;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, secret } = req.body;
            const User = yield user_model_1.default.findOne({ email }).exec();
            let existence = User ? yield userRecover_model_1.default.findOne({ user: User._id, password: secret }).exec() : null;
            if (User && existence && existence.timeout > Date.now()) {
                yield userRecover_model_1.default.deleteOne({ user: User === null || User === void 0 ? void 0 : User._id }).exec();
                User.password = password;
                User === null || User === void 0 ? void 0 : User.save().then(__ => { res.status(200).send({ data: 'reseted' }); }).catch(__ => { res.send({ error: routeHelpers_1.messages.ERROR_PASSWORD }); });
            }
            else {
                res.send({ error: routeHelpers_1.messages.ERROR_PASSWORD });
            }
        }
        catch (e) {
            res.status(400).send({ error: routeHelpers_1.messages.ERROR_PASSWORD });
        }
    });
}
exports.resetPassword = resetPassword;
function placeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.user) {
                console.log('user authentified via token, now should be cerating a new order');
                const { submitted_at, total_items, items, orderRef, state } = Object.assign({}, req.body);
                const newOrder = new orders_model_1.default({ submitted_at, total_items, items, orderRef, user: req.user._id, state });
                newOrder.save()
                    .then(order => {
                    console.log('should have created a new order');
                    res.status(200).json({ message: `${order.orderRef} registred` });
                })
                    .catch(e => {
                    console.log('there was an error trying to save the order');
                    console.log(e);
                    res.json({ error: routeHelpers_1.messages.ERROR_SAVING_ORDER
                    });
                });
            }
        }
        catch (e) {
            res.status(402).json({ error: routeHelpers_1.messages.ERROR_SAVING_ORDER });
        }
    });
}
exports.placeOrder = placeOrder;
function getOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.user) {
                const orders = yield orders_model_1.default.find({ user: req.user._id }).exec();
                const result = orders.map(model => ({
                    submitted_at: model.submitted_at,
                    total_items: model.total_items,
                    items: model.items,
                    orderRef: model.orderRef,
                    state: model.state,
                }));
                res.status(200).json({ orders: result });
            }
        }
        catch (e) {
            res.status(402).send({ error: routeHelpers_1.messages.ERROR_FETCHING_ORDER });
        }
    });
}
exports.getOrders = getOrders;
//# sourceMappingURL=user.js.map
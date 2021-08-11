"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const routeHelpers_1 = require("../helpers/routeHelpers");
const user_1 = require("../controllers/user");
const passport_1 = __importDefault(require("passport"));
const router = express_promise_router_1.default();
router.route('/signup').post(routeHelpers_1.validateBody(routeHelpers_1.schemas.signUpSchema), user_1.signUp);
router.route('/login').post(routeHelpers_1.validateBody(routeHelpers_1.schemas.passSchema), passport_1.default.authenticate('local'), user_1.signIn);
router.route('/auth/verify').post(passport_1.default.authenticate('jwt', { session: false }), user_1.verify);
router.route('/orders').get(passport_1.default.authenticate('jwt', { session: false }), user_1.getOrders);
router.route('/orders').post(passport_1.default.authenticate('jwt', { session: false }), user_1.placeOrder);
router.route('/update').post(routeHelpers_1.validateBody(routeHelpers_1.schemas.updateSchema), passport_1.default.authenticate('jwt', { session: false }, user_1.updateUser));
router.route('/recover').post(user_1.emailRecoverPassword);
router.route('/checkLink').post(user_1.checkLink);
router.route('/resetPassword').post(routeHelpers_1.validateBody(routeHelpers_1.schemas.resetPassword), user_1.resetPassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
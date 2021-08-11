import Router from 'express-promise-router';
import { validateBody, schemas } from '../helpers/routeHelpers';
import { signIn, signUp, verify, updateUser, emailRecoverPassword, checkLink, resetPassword, getOrders, placeOrder } from '../controllers/user';
import passport from 'passport';

const router = Router();

router.route('/signup').post(validateBody(schemas.signUpSchema), signUp);
router.route('/login').post(validateBody(schemas.passSchema), passport.authenticate('local'), signIn);
router.route('/auth/verify').post(passport.authenticate('jwt', { session: false}), verify);
router.route('/orders').get(passport.authenticate('jwt', {session: false}), getOrders)
router.route('/orders').post(passport.authenticate('jwt', {session: false}), placeOrder)

router.route('/update').post(validateBody(schemas.updateSchema), passport.authenticate('jwt', {session: false}, updateUser))

router.route('/recover').post(emailRecoverPassword);
router.route('/checkLink').post(checkLink)
router.route('/resetPassword').post(validateBody(schemas.resetPassword), resetPassword)



export default router;
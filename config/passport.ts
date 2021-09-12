import passport from 'passport';
import LocalStrategy from 'passport-local';
import JWTStrategy, { ExtractJwt } from 'passport-jwt';
import UserModel from '../models/user.model';
import { comparePassword } from '../models/user.model';
import { JWTToken } from '../controllers/user';
import dotenv from 'dotenv'
import { messages } from '../helpers/routeHelpers';

dotenv.config()

passport.serializeUser((user, done) => {
	done(null, user);
})

passport.deserializeUser((user, done) => {
	done(null, user as any)
})

async function JSTStrat(
	payload: JWTToken, 
	done: JWTStrategy.VerifiedCallback
): Promise<void> {
	try {
		const user = await UserModel.findById(payload.sub);
		if (!user) return done(null, false);
		done(null,user);
	} catch (error) {
		done(error, false);
	}
}

passport.use('jwt', new JWTStrategy.Strategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: process.env.JWT_AUTHORIZATION,
}, JSTStrat))

async function localStrat (username: string, password: string, done: any){
	console.log('[localStrat:passport.ts]: initializing local strategy')
	try {
		const user = await UserModel.findOne({ email: username }).exec();
		if (!user) return done(null, false, { message: messages.UNKNOWN_EMAIL});
		if (user && await comparePassword(password, user.password))
			return done(null, user)
		else{
			console.log('[localStrat:passport.ts]: Invalid username and password combination')
			return done(null, false, { message: messages.UNKOWN_USER_PASSWORD })
		} 
	} catch (error) {
		console.log('[localStrat:passport.ts]: inside catching error function')
		return done(error, false, { message: messages.ERROR_REQUEST })
	}
}


passport.use('local', new LocalStrategy.Strategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: false,
}, localStrat))



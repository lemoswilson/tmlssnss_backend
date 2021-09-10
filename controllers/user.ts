import { Response, Request } from 'express';
import JWT from 'jsonwebtoken';
import { messages, UserBodyRequest, OrderBodyRequest } from '../helpers/routeHelpers';
import transport, { options } from '../src/mailer';
import UserModel, { comparePassword, UserModel as UserModelType } from '../models/user.model';
import OrdersModel from '../models/orders.model';
import { makeid } from '../helpers/routeHelpers';
import userModel from '../models/user.model';
import UserRecoverModel from '../models/userRecover.model';

export interface JWTToken {
	iss: string,
	sub: string,
	iat: Date,
	exp: Date,
}

export function signToken(user: {_id: string }): string {
	const token = JWT.sign({
		iss: 'tmlssnss',
		sub: user._id,
		iat: new Date().getTime(),
		expo: new Date().setDate(new Date().getDate() + 1),
	}, process.env.JWT_AUTHORIZATION);
	return token;
}

export async function verify(req: Request, res: Response): Promise<void>{
	try {
		if (!req.user){
			res.status(202).json({data: 'invalid or expired token'})
		}
		else {
			const user: UserModelType = req.user;
			res.status(200).send({ data: true, name: user.first_name })
		}
	} catch(e) {
		res.status(403).send(e);
	}
}

export async function signUp(req: UserBodyRequest, res: Response): Promise<void> {
	try {
		const data = {...req.body }

		const existence = await UserModel.findOne({ email: data.email }).exec();

		if (!existence){
			const NewUser = new UserModel({...data})
			NewUser.save()
				.then((user) => { res.status(200).json({ token: signToken(user._id), name: user.first_name })})
				.catch((err) => { res.send({error: err})})
		} else if (existence){
			res.status(202).send({ error: messages.USER_ALREADY_EXISTS })
		} 
	} catch (err) {
		res.status(403).send(err);
	}
};

export async function signIn(req: Request, res: Response): Promise<void> {
	try {
		if (req.user){
			const token = signToken(req.user);
			res.status(200).json({token, name: req.user.first_name})
		}
	} catch {

	}
}

export async function updateUser(req: UserBodyRequest, res: Response): Promise<void> {
	try {
		const User: UserModelType | null | undefined = req.user;
			const match = req.body.old_password && User && User.password ? await comparePassword(req.body.old_password, User.password) : undefined;
			if (match && User && req.body.password){
				User.password = req.body.password
				User.save()
					.then(_ => res.status(200).send({message: messages.PASSWORD_UPDATE}))
					.catch(_ => res.send({error: messages.ERROR_PASSWORD}))
			}
	} catch(e) {
		res.status(402).json({error: messages.ERROR_PASSWORD})
	}
}

function checkAndEmail(
	err: any,
	_: any,
	res: Response,
	existence: UserModelType | null,
	pass: string,
) {
	if (err){
        res.send({error: 'there was an error while trying to send you an email, please try again later'});
    } else {
        transport.sendMail({
            ...options, 
            text: `Reset your password by visiting ${process.env.REACT_APP_URL}/reset?mail=${existence?.email}&rcp=${pass}`,
            to: existence?.email,
        })
        res.status(200).send({data: 'An email has been sent to you'})
    }
}

export async function emailRecoverPassword(req: Request, res: Response): Promise<void> {
	try {
		const existence = await userModel.findOne({ email: req.body.email }).exec()
		if (existence) {
			const exist_rec = await UserRecoverModel.findOne({user: existence._id}).exec()
			const password = makeid(65);
			const timeout = Date.now() + (60 * 45 * 1000);
	
			if (exist_rec){
				exist_rec.password = password;
				exist_rec.timeout = timeout
				exist_rec.save()
				.then(_ => {
					checkAndEmail(
						undefined, 
						undefined, 
						res, 
						existence, 
						password
					)
				})
				.catch(e => {
					checkAndEmail(
						e, 
						undefined, 
						res, 
						existence, 
						password
					)
				})
			} else {
				const newUser = new UserRecoverModel({user: existence._id, password, timeout})
				newUser.save()
				.then(_ => {
					checkAndEmail(
						undefined, 
						undefined, 
						res, 
						existence, 
						password
					)
				})
				.catch(e => {
					checkAndEmail(e, undefined, res, existence, password)
				})
			}
		} else {
			res.status(202).send({error: messages.UNKNOWN_EMAIL})
		}
	} catch (e) {
		res.status(403).send(e)
	}
}

export async function checkLink(req: Request, res: Response): Promise<void> {
	try {
		const { email, rcp } = req.body;
		const User = await UserModel.findOne({email}).exec()

        if (User){
            const existence = await UserRecoverModel.findOne({user: User._id, password: rcp}).exec();
            if (existence){
                const now = Date.now() ;

                if (now < existence.timeout){
                    res.status(200).send({data: 'allowed'})
                } else {
                    res.status(202).send({ error: 'expired link' })
                }
            } else {
                res.status(202).json({error: messages.INVALID_RESET_LINK});
            }
        }
	} catch (e) {
		res.status(202).send(e);
	}
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
	try {
		const { email, password, secret } = req.body
		const User = await UserModel.findOne({email}).exec()
		let existence = User ? await UserRecoverModel.findOne({user: User._id, password: secret}).exec() : null;

		if (User && existence && existence.timeout > Date.now()){
			await UserRecoverModel.deleteOne({user: User?._id}).exec()
			User.password = password;
			User?.save()
			.then(__ => { res.status(200).send({data: 'reseted'}) })
			.catch(__ => { res.send({error: messages.ERROR_PASSWORD}) })
		} else {
			res.send({error: messages.ERROR_PASSWORD})
		}
	} catch (e) {
		res.status(400).send({error: messages.ERROR_PASSWORD})
	}
}

export async function placeOrder(req: OrderBodyRequest, res: Response): Promise<void> {
	try {
		if (req.user) {
			// user authentified via token, now should be cerating a new order
			const { submitted_at, total_items, items, orderRef, state } = { ...req.body }
			const newOrder = new OrdersModel({submitted_at, total_items, items, orderRef, user: req.user._id, state})
			newOrder.save()
				.then(order => {
					// console.log('should have created a new order')
					res.status(200).json({message: `${order.orderRef} registred`});
				})
				.catch(_ => {
					// console.log('there was an error trying to save the order')
					res.json({error: messages.ERROR_SAVING_ORDER
				})})
		}
	} catch (e) {
		res.status(402).json({error: messages.ERROR_SAVING_ORDER})
	}
}

export async function getOrders(req: Request, res: Response): Promise<void> {
	try {
		if (req.user) {
			const orders = await OrdersModel.find({user: req.user._id}).exec();
			const result = orders.map(model => ( 
				{ 
					submitted_at: model.submitted_at, 
					total_items: model.total_items,
					items: model.items, 
					orderRef: model.orderRef,
					state: model.state,
				} 
			))
			res.status(200).json({orders: result})
		}
	} catch (e) {
		res.status(402).send({error: messages.ERROR_FETCHING_ORDER})
	}
}


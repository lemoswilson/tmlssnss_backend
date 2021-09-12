import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { updateUser } from '../models/user.model';
import { OrderBody } from '../models/orders.model';

export enum messages {
	USER_ALREADY_EXISTS = 'An user is already registered with this email, please try again using other address',
	PASSWORD_UPDATE = 'Your password was updated',
	ERROR_PASSWORD = 'There was an error trying to update your password, please try again',
	UNKNOWN_EMAIL = 'There is no user registred under this email',
	INVALID_RESET_LINK = 'Invalid reset link',
	UNKOWN_USER_PASSWORD = 'The password entered is incorrect',
	ERROR_SAVING_ORDER = 'There was an error saving the order to users database',
	ERROR_FETCHING_ORDER = 'There was an error trying to fetch your orders',
	ERROR_REQUEST = "There was an error processing your request, please try again",
}

export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<RecursivePartial<U>> : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

export type UserBodyRequest = Request<ParamsDictionary, any, RecursivePartial<updateUser>, Query>
export type OrderBodyRequest = Request<ParamsDictionary, any, OrderBody, Query>

declare module 'express' {
	export interface Request {
		user?: any,
	}
}

export function validateBody(schema: Joi.ObjectSchema<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		console.log('[validateBody:routeHelpers.ts]: validating body')
		const validation = schema.validate(req.body);
		if (validation.error) {
			console.log('[validateBody:routeHelpers.ts]: validating error')
			return res.status(400).json({error: validation.error.message})
		}

		req.body = { ...validation.value }

		return next();
	}
}

export function makeid(length: number){
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

export const schemas = {
	signUpSchema: Joi.object().keys({
		email: Joi.string().email().required(),
		first_name: Joi.string().required().insensitive(),
		last_name: Joi.string().required().insensitive(),
        password: Joi.string().required().regex(/^(?=.{6,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
	}),
	updateSchema: Joi.object().keys({
		old_password: Joi.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
		password: Joi.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
		confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
	}),
	passSchema: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
	resetPassword: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required().regex(/^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
		secret: Joi.string().required().regex(/^(?=.{64}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
		confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
	})
}
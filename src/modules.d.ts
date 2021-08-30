declare namespace NodeJS{
	interface ProcessEnv {
		MONGO_URI: string,
		JWT_AUTHORIZATION: string,
		REACT_APP_URL: string,
		EMAIL_SERVICE: string, 
		EMAIL_USER: string,
		EMAIL_PASS: string,
	}
}

// declare module 'express' {
// 	export interface Request {
// 		user?: any,
// 	}
// }
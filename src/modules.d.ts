declare namespace NodeJS{
	interface ProcessEnv {
		ATLAS_URI: string,
		JWT_AUTHORIZATION: string,
		REACT_APP_URL: string,
	}
}

// declare module 'express' {
// 	export interface Request {
// 		user?: any,
// 	}
// }
export interface DecodedUser {
	email: string
	roleId: number
}

declare global {
	namespace Express {
		interface Request {
			user?: DecodedUser
		}
	}
}

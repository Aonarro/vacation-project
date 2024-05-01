export type RegistrationInput = {
	firstName: string
	lastName: string
	email: string
	password: string
}

export type LoginInput = {
	email: string
	password: string
}

interface DecodedUser {
	id: string
	username: string
	// Add other properties returned by verifyToken function
}

declare global {
	namespace Express {
		interface Request {
			user?: DecodedUser
		}
	}
}

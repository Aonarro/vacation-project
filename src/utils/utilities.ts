import jwt from 'jsonwebtoken'

export function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET
	if (!secret) {
		throw new Error('JWT_SECRET is not defined')
	}
	return secret
}

export function generateAccessToken(email: string, roleId: number): string {
	const token = jwt.sign({ email, roleId }, getJwtSecret(), {
		expiresIn: '1min',
	})

	return token
}

export function generateRefreshToken(email: string, roleId: number): string {
	const token = jwt.sign({ email, roleId }, getJwtSecret(), {
		expiresIn: '2min',
	})

	return token
}

export function verifyToken(token: string): any {
	try {
		const decoded = jwt.verify(token, getJwtSecret())
		return decoded
	} catch (error) {
		return null
	}
}

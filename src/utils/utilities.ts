import jwt from 'jsonwebtoken'

export function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET
	if (!secret) {
		throw new Error('JWT_SECRET is not defined')
	}
	return secret
}

export function generateAccessToken(email: string, roleId: number): string {
	return jwt.sign({ email, roleId }, getJwtSecret(), { expiresIn: '5m' })
}

export function generateRefreshToken(email: string, roleId: number): string {
	return jwt.sign({ email, roleId }, getJwtSecret(), { expiresIn: '3d' })
}

export function verifyToken(token: string): any {
	try {
		return jwt.verify(token, getJwtSecret())
	} catch (error) {
		return null
	}
}

import { Request, Response } from 'express'

export const uploadImg = async (req: Request, res: Response) => {
	try {
		res.status(201).json(req.file?.filename)
	} catch (error) {
		res.json(500)
	}
}

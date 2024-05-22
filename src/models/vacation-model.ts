import Joi from 'joi'

export const createVacationSchema = Joi.object({
	destination: Joi.string().required(),
	description: Joi.string().required(),
	startDate: Joi.date().iso().required(),
	endDate: Joi.date().iso().required(),
	price: Joi.number().positive().required(),
	file: Joi.string().optional(),
})

export const updateVacationSchema = Joi.object({
	destination: Joi.string().optional(),
	description: Joi.string().optional(),
	startDate: Joi.date().iso().optional(),
	endDate: Joi.date().iso().optional(),
	price: Joi.number().positive().optional(),
	file: Joi.string().optional(),
})

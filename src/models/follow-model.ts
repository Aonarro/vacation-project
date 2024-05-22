import Joi from 'joi'

export const unFollow = Joi.object({
	userId: Joi.number().required(),
	vacationId: Joi.number().required(),
})

export const follow = Joi.object({
	userId: Joi.number().integer().required(),
	vacationId: Joi.number().integer().required(),
})

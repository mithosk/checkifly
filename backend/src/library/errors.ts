import { FastifyError } from 'fastify'

class CustomError extends Error implements FastifyError {
	code: string

	constructor(code: string, message: string) {
		super(message)

		this.code = code
	}
}

export class ForbiddenError extends CustomError {
	customCode?: string

	constructor(customCode: 'PROJECT_NOT_FOUND', message: string) {
		super('FORBIDDEN', message)

		this.customCode = customCode
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super('NOT_FOUND', message)
	}
}

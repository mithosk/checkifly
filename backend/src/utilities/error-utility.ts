import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { ForbiddenError, NotFoundError } from '@library'

const errorUtility: FastifyPluginAsync = async server => {
	server.setErrorHandler((error, request, reply): void => {
		//Bad Request
		if (
			error.statusCode === 400 &&
			error.validationContext &&
			error.validation &&
			error.validation.length > 0
		) {
			reply.code(400).send({
				type: `400 BAD_REQUEST`,
				message: `in ${error.validationContext} ${error.validation[0].instancePath} ${error.validation[0].message}`
			})
		}
		//Forbidden
		else if (error instanceof ForbiddenError) {
			reply.code(403).send({
				type: `403 ${error.code}`,
				customCode: (error as ForbiddenError).customCode,
				message: error.message
			})
		}
		//Not Found
		else if (error instanceof NotFoundError) {
			reply.code(404).send({
				type: `404 ${error.code}`,
				message: error.message
			})
		}
		//Internal Server Error
		else {
			reply.code(500).send({
				type: `500 ${error.code}`,
				message: error.message
			})
		}
	})
}

export default fp(errorUtility)

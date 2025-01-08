import fp from 'fastify-plugin'
import { getEnvParam } from '@library'
import { FastifyAuthFunction } from '@fastify/auth'
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
	interface FastifyInstance {
		apiKeyAuth: () => FastifyAuthFunction
	}
}

const apiKeyAuthUtility: FastifyPluginAsync = async server => {
	const apiKeyAuth: () => FastifyAuthFunction =
		() => async (request: FastifyRequest, response: FastifyReply) => {
			const apiKey = request.headers['x-api-key']

			if (!apiKey || apiKey !== getEnvParam('API_KEY')) response.status(401).send()
		}

	server.decorate('apiKeyAuth', apiKeyAuth)
}

export default fp(apiKeyAuthUtility)

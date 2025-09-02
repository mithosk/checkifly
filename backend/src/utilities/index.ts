import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async server => {
	server.register(import('./api-key-auth-utility'))
	server.register(import('./error-utility'))
}

export default fp(plugin)

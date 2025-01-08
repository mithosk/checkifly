import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async server => {
	server.register(import('./api-key-auth-utility'))
}

export default fp(plugin)

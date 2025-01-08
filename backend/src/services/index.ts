import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async server => {
	server.register(import('./error-log'))
}

export default fp(plugin)

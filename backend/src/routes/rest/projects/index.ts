import { FastifyPluginAsync } from 'fastify'

const projectsRoute: FastifyPluginAsync = async server => {
	server.register(import('./error-logs'), {
		prefix: ':projectId/error-logs'
	})
}

export default projectsRoute

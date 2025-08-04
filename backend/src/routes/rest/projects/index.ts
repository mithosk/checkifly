import { FastifyPluginAsync } from 'fastify'

const projectsRoute: FastifyPluginAsync = async server => {
	server.register(import('./error-log-groups'), {
		prefix: ':projectId/error-log-groups'
	})

	server.register(import('./error-logs'), {
		prefix: ':projectId/error-logs'
	})
}

export default projectsRoute

import { FastifyPluginAsync } from 'fastify'

const restRoute: FastifyPluginAsync = async server => {
    server.register(import('./error-logs'), {
        prefix: 'error-logs'
    })

    server.register(import('./projects'), {
        prefix: 'projects'
    })
}

export default restRoute
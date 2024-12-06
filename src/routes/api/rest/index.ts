import { FastifyPluginAsync } from 'fastify'

const restRoute: FastifyPluginAsync = async server => {
    server.register(import('./error-logs'), {
        prefix: 'error-logs'
    })
}

export default restRoute
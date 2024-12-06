import { FastifyPluginAsync } from 'fastify'

const apiRoute: FastifyPluginAsync = async server => {
    server.register(import('./rest'), {
        prefix: 'rest'
    })
}

export default apiRoute
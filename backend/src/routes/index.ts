import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async server => {
    server.register(import('./rest'), {
        prefix: 'rest'
    })
}

export default plugin
import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async server => {
    server.register(import('./api'), {
        prefix: 'api'
    })
}

export default plugin
import fp from 'fastify-plugin'
import { errorLogMap } from './mapper'
import { errorLogModel } from '@mongoose'
import { FastifyPluginAsync } from 'fastify'
import { createCreateService, ICreateService } from './create-service'
import { ErrorLogRepository } from './repositories/error-log-repository'

declare module 'fastify' {
    interface FastifyInstance {
        errorLog: {
            createService: ICreateService
        }
    }
}

const errorLogRepository = new ErrorLogRepository(errorLogModel)

const errorLogService: FastifyPluginAsync = async server => {
    server.register(
        fp(async () => {
            server.decorate('errorLog', {
                createService: createCreateService(errorLogRepository, errorLogMap)
            })
        })
    )
}

export default fp(errorLogService)
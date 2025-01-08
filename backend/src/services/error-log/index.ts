import fp from 'fastify-plugin'
import { Pager } from '@library'
import { errorLogMap } from './mapper'
import { errorLogModel } from '@mongoose'
import { FastifyPluginAsync } from 'fastify'
import { createListService, IListService } from './list-service'
import { createCreateService, ICreateService } from './create-service'
import { ErrorLogRepository } from './repositories/error-log-repository'

declare module 'fastify' {
	interface FastifyInstance {
		errorLog: {
			createService: ICreateService
			listService: IListService
		}
	}
}

const errorLogRepository = new ErrorLogRepository(errorLogModel)
const pager = new Pager()

const errorLogService: FastifyPluginAsync = async server => {
	server.register(
		fp(async () => {
			server.decorate('errorLog', {
				createService: createCreateService(errorLogRepository, errorLogMap),
				listService: createListService(errorLogRepository, errorLogMap, pager)
			})
		})
	)
}

export default fp(errorLogService)

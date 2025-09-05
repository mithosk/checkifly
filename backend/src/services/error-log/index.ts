import fp from 'fastify-plugin'
import { hash, Pager } from '@library'
import { errorLogMap } from './mapper'
import { errorLogModel } from '@mongoose'
import { FastifyPluginAsync } from 'fastify'
import { createListService, IListService } from './list-service'
import { createCreateService, ICreateService } from './create-service'
import { ErrorLogRepository } from './repositories/error-log-repository'
import { createGroupListService, IGroupListService } from './group-list-service'

declare module 'fastify' {
	interface FastifyInstance {
		errorLog: {
			createService: ICreateService
			listService: IListService
			groupListService: IGroupListService
		}
	}
}

const errorLogService: FastifyPluginAsync = async server => {
	const errorLogRepository = new ErrorLogRepository(errorLogModel)
	const pager = new Pager()

	server.register(
		fp(async () => {
			server.decorate('errorLog', {
				createService: createCreateService(errorLogRepository, errorLogMap, hash),
				listService: createListService(errorLogRepository, errorLogMap, pager),
				groupListService: createGroupListService(errorLogRepository, pager)
			})
		})
	)
}

export default fp(errorLogService)

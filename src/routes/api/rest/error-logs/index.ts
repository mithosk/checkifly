import { FastifyPluginAsync } from 'fastify'
import { createErrorLogSchema, errorLogSchema, TCreateErrorLogDto, TErrorLogDto } from './dto'

const errorLogsRoute: FastifyPluginAsync = async server => {
	server.post<{ Body: TCreateErrorLogDto, Reply: TErrorLogDto }>('/',
		{
			schema: {
				body: createErrorLogSchema,
				response: {
					201: errorLogSchema
				}
			}
		},
		async (request, response) =>
			response.status(201).send(
				await server.errorLog.createService({
					projectId: request.body.projectId,
					groupingName: request.body.groupingName,
					stackTrace: request.body.stackTrace,
					level: request.body.level,
					details: request.body.details
				})
			)
	)
}

export default errorLogsRoute
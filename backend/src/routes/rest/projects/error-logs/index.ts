import { FastifyPluginAsync } from 'fastify'
import {
	errorLogsSchema,
	TErrorLogsDto,
	errorLogListParamsSchema,
	TErrorLogListParamsDto,
	TErrorLogQuerystringDto,
	errorLogQuerystringSchema
} from './dto'

const errorLogsRoute: FastifyPluginAsync = async server => {
	server.get<{ Params: TErrorLogListParamsDto; Querystring: TErrorLogQuerystringDto; Reply: TErrorLogsDto }>(
		'/',
		{
			schema: {
				params: errorLogListParamsSchema,
				querystring: errorLogQuerystringSchema,
				response: {
					200: errorLogsSchema
				}
			}
		},
		async request =>
			server.errorLog.listService({
				projectId: request.params.projectId,
				groupingName: request.query.groupingName,
				pageIndex: request.query.pageIndex,
				pageSize: request.query.pageSize
			})
	)
}

export default errorLogsRoute

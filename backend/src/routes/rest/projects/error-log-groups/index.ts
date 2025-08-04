import { FastifyPluginAsync } from 'fastify'
import {
	TErrorLogGroupListParamsDto,
	TErrorLogGroupQuerystringDto,
	TErrorLogGroupsDto,
	errorLogGroupListParamsSchema,
	errorLogGroupQuerystringSchema,
	errorLogGroupsSchema
} from './dto'

const errorLogGroupsRoute: FastifyPluginAsync = async server => {
	server.get<{
		Params: TErrorLogGroupListParamsDto
		Querystring: TErrorLogGroupQuerystringDto
		Reply: TErrorLogGroupsDto
	}>(
		'/',
		{
			schema: {
				params: errorLogGroupListParamsSchema,
				querystring: errorLogGroupQuerystringSchema,
				response: {
					200: errorLogGroupsSchema
				}
			}
		},
		async request =>
			server.errorLog.groupListService({
				projectId: request.params.projectId,
				groupingName: request.query.groupingName,
				pageIndex: request.query.pageIndex,
				pageSize: request.query.pageSize
			})
	)
}

export default errorLogGroupsRoute

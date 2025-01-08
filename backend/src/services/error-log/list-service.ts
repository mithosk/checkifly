import { IPager } from '@library'
import { IErrorLogMap, TErrorLogResult } from './mapper'
import { IErrorLogRepository } from './repositories/error-log-repository'

type TArgs = {
	projectId?: string
	groupingName?: string
	pageIndex: number
	pageSize: number
}

type TResult = {
	page: TErrorLogResult[]
	pageCount: number
	itemCount: number
}

export interface IListService {
	(args: TArgs): Promise<TResult>
}

export const createListService =
	(errorLogRepository: IErrorLogRepository, errorLogMap: IErrorLogMap, pager: IPager): IListService =>
	async (args: TArgs): Promise<TResult> => {
		const filter = {
			projectId: args.projectId,
			groupingName: args.groupingName
		}

		const items = await errorLogRepository.findMany(
			filter,
			pager.skip(args.pageIndex, args.pageSize),
			args.pageSize
		)

		const itemCount = await errorLogRepository.count(filter)

		return {
			page: items.map(item => errorLogMap(item)),
			pageCount: pager.pageCount(itemCount, args.pageSize),
			itemCount
		}
	}

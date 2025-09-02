import { IPager } from '@library'
import { IErrorLogRepository } from './repositories/error-log-repository'

type TArgs = {
	projectId?: string
	groupingName?: string
	pageIndex: number
	pageSize: number
}

type TResult = {
	page: {
		projectId: string
		groupingName: string
		groupingHash: string
		level: 'LOW' | 'MEDIUM' | 'HIGH'
		size: number
		date: string
	}[]
	pageCount: number
	itemCount: number
}

export interface IGroupListService {
	(args: TArgs): Promise<TResult>
}

export const createGroupListService =
	(errorLogRepository: IErrorLogRepository, pager: IPager): IGroupListService =>
	async (args: TArgs): Promise<TResult> => {
		const filter = {
			projectId: args.projectId,
			groupingName: args.groupingName
		}

		const items = await errorLogRepository.groupForGroupingHash(
			filter,
			pager.skip(args.pageIndex, args.pageSize),
			args.pageSize
		)

		const itemCount = await errorLogRepository.countForGroupingHash(filter)

		return {
			page: items.map(item => {
				return {
					projectId: item.projectId,
					groupingName: item.groupingName,
					groupingHash: item.groupingHash,
					level: item.level,
					size: item.size,
					date: item.date.toISOString()
				}
			}),
			pageCount: pager.pageCount(itemCount, args.pageSize),
			itemCount
		}
	}

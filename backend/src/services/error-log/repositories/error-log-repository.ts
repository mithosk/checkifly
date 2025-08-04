import { TErrorLog } from '@mongoose'
import { IMongooseModel } from '@library'
import { RootFilterQuery } from 'mongoose'

type TCreateErrorLogData = {
	projectId: string
	groupingName: string
	stackTrace: string
	level: 'LOW' | 'MEDIUM' | 'HIGH'
	details: {
		name: string
		value: string
	}[]
}

type TErrorLogFilter = {
	projectId?: string
	groupingName?: string
}

export type TErrorLogEntity = TErrorLog

export type TGroupingNameGroup = {
	projectId: string
	groupingName: string
	level: 'LOW' | 'MEDIUM' | 'HIGH'
	size: number
	date: Date
}

export interface IErrorLogRepository {
	create(data: TCreateErrorLogData): Promise<TErrorLogEntity>
	findMany(filter: TErrorLogFilter, skip?: number, take?: number): Promise<TErrorLogEntity[]>
	count(filter: TErrorLogFilter): Promise<number>
	groupForGroupingName(filter: TErrorLogFilter, skip?: number, take?: number): Promise<TGroupingNameGroup[]>
	countForGroupingName(filter: TErrorLogFilter): Promise<number>
}

export class ErrorLogRepository implements IErrorLogRepository {
	constructor(private readonly errorLogModel: IMongooseModel<TErrorLog>) {}

	public create(data: TCreateErrorLogData): Promise<TErrorLogEntity> {
		return this.errorLogModel.create({
			projectId: data.projectId,
			groupingName: data.groupingName,
			stackTrace: data.stackTrace,
			level: data.level,
			details: data.details
		})
	}

	public findMany(filter: TErrorLogFilter, skip?: number, take?: number): Promise<TErrorLogEntity[]> {
		return this.errorLogModel
			.find(this.where(filter))
			.sort({ createdAt: -1 })
			.skip(skip ?? 0)
			.limit(take ?? Number.MAX_SAFE_INTEGER)
	}

	public count(filter: TErrorLogFilter): Promise<number> {
		return this.errorLogModel.countDocuments(this.where(filter))
	}

	public groupForGroupingName(
		filter: TErrorLogFilter,
		skip?: number,
		take?: number
	): Promise<TGroupingNameGroup[]> {
		return this.errorLogModel
			.aggregate([
				{
					$match: this.where(filter)
				},
				{
					$addFields: {
						numericLevel: {
							$switch: {
								branches: [
									{ case: { $eq: ['$level', 'LOW'] }, then: 1 },
									{ case: { $eq: ['$level', 'MEDIUM'] }, then: 2 },
									{ case: { $eq: ['$level', 'HIGH'] }, then: 3 }
								],
								default: 0
							}
						}
					}
				},
				{
					$group: {
						_id: {
							projectId: '$projectId',
							groupingName: '$groupingName'
						},
						numericLevel: { $max: '$numericLevel' },
						size: { $sum: 1 },
						date: { $max: '$createdAt' }
					}
				},
				{
					$project: {
						_id: 0,
						projectId: '$_id.projectId',
						groupingName: '$_id.groupingName',
						level: {
							$switch: {
								branches: [
									{ case: { $eq: ['$numericLevel', 1] }, then: 'LOW' },
									{ case: { $eq: ['$numericLevel', 2] }, then: 'MEDIUM' },
									{ case: { $eq: ['$numericLevel', 3] }, then: 'HIGH' }
								],
								default: ''
							}
						},
						size: '$size',
						date: '$date'
					}
				}
			])
			.sort({ date: -1 })
			.skip(skip ?? 0)
			.limit(take ?? Number.MAX_SAFE_INTEGER)
	}

	public async countForGroupingName(filter: TErrorLogFilter): Promise<number> {
		return (
			(
				await this.errorLogModel.aggregate([
					{
						$match: this.where(filter)
					},
					{
						$group: {
							_id: {
								projectId: '$projectId',
								groupingName: '$groupingName'
							}
						}
					},
					{
						$count: 'count'
					}
				])
			)[0]?.count ?? 0
		)
	}

	private where(filter: TErrorLogFilter): RootFilterQuery<TErrorLogFilter> {
		const clause: RootFilterQuery<TErrorLogFilter> = {}

		if (filter.projectId) clause.projectId = filter.projectId

		if (filter.groupingName) clause.groupingName = filter.groupingName

		return clause
	}
}

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

export interface IErrorLogRepository {
	create(data: TCreateErrorLogData): Promise<TErrorLogEntity>
	findMany(filter: TErrorLogFilter, skip?: number, take?: number): Promise<TErrorLogEntity[]>
	count(filter: TErrorLogFilter): Promise<number>
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
			.skip(skip ?? Number.MAX_VALUE)
			.limit(take ?? Number.MAX_VALUE)
	}

	public count(filter: TErrorLogFilter): Promise<number> {
		return this.errorLogModel.countDocuments(this.where(filter))
	}

	private where(filter: TErrorLogFilter): RootFilterQuery<TErrorLogFilter> {
		const clause: RootFilterQuery<TErrorLogFilter> = {}

		if (filter.projectId) clause.projectId = filter.projectId

		if (filter.groupingName) clause.groupingName = filter.groupingName

		return clause
	}
}

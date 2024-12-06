import { TErrorLog } from '@mongoose'
import { IMongooseModel } from '@library'

type CreateErrorLogData = {
	projectId: string
	groupingName: string
	stackTrace: string
	level: 'LOW' | 'MEDIUM' | 'HIGH'
	details: {
		name: string
		value: string
	}[]
}

export type TErrorLogEntity = TErrorLog

export interface IErrorLogRepository {
	create(data: CreateErrorLogData): Promise<TErrorLogEntity>
}

export class ErrorLogRepository implements IErrorLogRepository {
	constructor(
		private readonly errorLogModel: IMongooseModel<TErrorLog>
	) { }

	public create(data: CreateErrorLogData): Promise<TErrorLogEntity> {
		return this.errorLogModel.create({
			projectId: data.projectId,
			groupingName: data.groupingName,
			stackTrace: data.stackTrace,
			level: data.level,
			details: data.details
		})
	}
}
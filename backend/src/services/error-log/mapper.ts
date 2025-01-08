import { TErrorLogEntity } from './repositories/error-log-repository'

export type TErrorLogResult = {
	id: string
	projectId: string
	groupingName: string
	stackTrace: string
	level: 'LOW' | 'MEDIUM' | 'HIGH'
	details: {
		name: string
		value: string
	}[]
}

export interface IErrorLogMap {
	(entity: TErrorLogEntity): TErrorLogResult
}

export const errorLogMap: IErrorLogMap = (entity: TErrorLogEntity): TErrorLogResult => {
	return {
		id: entity.id,
		projectId: entity.projectId,
		groupingName: entity.groupingName,
		stackTrace: entity.stackTrace,
		level: entity.level,
		details: entity.details
	}
}

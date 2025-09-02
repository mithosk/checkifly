import { IHash } from '@library'
import { IErrorLogMap, TErrorLogResult } from './mapper'
import { IErrorLogRepository } from './repositories/error-log-repository'

type TArgs = {
	projectId: string
	groupingName: string
	stackTrace: string
	level: 'LOW' | 'MEDIUM' | 'HIGH'
	details: {
		name: string
		value: string
	}[]
}

export interface ICreateService {
	(args: TArgs): Promise<TErrorLogResult>
}

export const createCreateService =
	(errorLogRepository: IErrorLogRepository, errorLogMap: IErrorLogMap, hash: IHash): ICreateService =>
	async (args: TArgs): Promise<TErrorLogResult> => {
		return errorLogMap(
			await errorLogRepository.create({
				projectId: args.projectId,
				groupingName: args.groupingName,
				groupingHash: await hash(args.groupingName),
				stackTrace: args.stackTrace,
				level: args.level,
				details: args.details
			})
		)
	}

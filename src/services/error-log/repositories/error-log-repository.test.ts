import { TErrorLog } from '@mongoose'
import { IMongooseModel } from '@library'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { ErrorLogRepository, IErrorLogRepository } from './error-log-repository'

describe('errorLog', () => {
	describe('ErrorLogRepository', () => {
		let repository: IErrorLogRepository
		const errorLogModel = mockDeep<IMongooseModel<TErrorLog>>()

		beforeEach(() => {
			mockReset(errorLogModel)

			repository = new ErrorLogRepository(errorLogModel)
		})

		describe('create', () => {
			it('creates a new error log', async () => {
				const projectId = 'aaaaa'
				const groupingName = 'bbbbb'
				const stackTrace = 'ccccc'
				const level = 'LOW'
				const details = [
					{
						name: 'ddddd',
						value: 'eeeee'
					},
					{
						name: 'fffff',
						value: 'ggggg'
					}
				]

				await repository.create({
					projectId,
					groupingName,
					stackTrace,
					level,
					details
				})

				expect(errorLogModel.create).toHaveBeenCalledTimes(1)
				expect(errorLogModel.create.mock.calls[0][0]).toEqual({
					projectId,
					groupingName,
					stackTrace,
					level,
					details
				})
			})
		})
	})
})
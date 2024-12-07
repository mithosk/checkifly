import { v4 as uuid } from 'uuid'
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
				const projectId = uuid()
				const groupingName = 'aaaaa'
				const stackTrace = 'bbbbb'
				const level = 'LOW'
				const details = [
					{
						name: 'ccccc',
						value: 'ddddd'
					},
					{
						name: 'eeeee',
						value: 'fffff'
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
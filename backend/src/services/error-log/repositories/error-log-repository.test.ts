import { v4 as uuid } from 'uuid'
import { TErrorLog } from '@mongoose'
import { IMongooseModel } from '@library'
import { ErrorLogRepository, IErrorLogRepository } from './error-log-repository'

describe('errorLog', () => {
	describe('ErrorLogRepository', () => {
		let repository: IErrorLogRepository

		let errorLogModelSkip: {
			limit: jest.Mock
		}

		let errorLogModelFind: {
			skip: jest.Mock
		}

		let errorLogModel: {
			create: jest.Mock,
			find: jest.Mock,
			countDocuments: jest.Mock
		}

		beforeEach(() => {
			errorLogModelSkip = {
				limit: jest.fn()
			}

			errorLogModelFind = {
				skip: jest.fn().mockReturnValue(errorLogModelSkip)
			}

			errorLogModel = {
				create: jest.fn(),
				find: jest.fn().mockReturnValue(errorLogModelFind),
				countDocuments: jest.fn()
			}

			repository = new ErrorLogRepository(errorLogModel as unknown as IMongooseModel<TErrorLog>)
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

		describe('findMany', () => {
			it('search all error logs', async () => {
				await repository.findMany({})

				expect(errorLogModel.find).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find.mock.calls[0]).toEqual([{}])
			})

			it('search error logs filtered by projectId', async () => {
				const projectId = uuid()

				await repository.findMany({
					projectId
				})

				expect(errorLogModel.find).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find.mock.calls[0]).toEqual([{
					projectId
				}])
			})

			it('search error logs filtered by groupingName', async () => {
				const groupingName = uuid()

				await repository.findMany({
					groupingName
				})

				expect(errorLogModel.find).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find.mock.calls[0]).toEqual([{
					groupingName
				}])
			})

			it('search error logs skipping records', async () => {
				const skip = 12345

				await repository.findMany({}, skip)

				expect(errorLogModelFind.skip).toHaveBeenCalledTimes(1)
				expect(errorLogModelFind.skip.mock.calls[0]).toEqual([skip])
			})

			it('search error logs limiting records', async () => {
				const limit = 54321

				await repository.findMany({}, 11111, limit)

				expect(errorLogModelSkip.limit).toHaveBeenCalledTimes(1)
				expect(errorLogModelSkip.limit.mock.calls[0]).toEqual([limit])
			})
		})

		describe('count', () => {
			it('count all error logs', async () => {
				await repository.count({})

				expect(errorLogModel.countDocuments).toHaveBeenCalledTimes(1)
				expect(errorLogModel.countDocuments.mock.calls[0]).toEqual([{}])
			})

			it('count error logs filtered by projectId', async () => {
				const projectId = uuid()

				await repository.count({
					projectId
				})

				expect(errorLogModel.countDocuments).toHaveBeenCalledTimes(1)
				expect(errorLogModel.countDocuments.mock.calls[0]).toEqual([{
					projectId
				}])
			})

			it('count error logs filtered by groupingName', async () => {
				const groupingName = uuid()

				await repository.count({
					groupingName
				})

				expect(errorLogModel.countDocuments).toHaveBeenCalledTimes(1)
				expect(errorLogModel.countDocuments.mock.calls[0]).toEqual([{
					groupingName
				}])
			})
		})
	})
})
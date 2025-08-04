import { v4 as uuid } from 'uuid'
import { TErrorLog } from '@mongoose'
import { IMongooseModel } from '@library'
import { ErrorLogRepository, IErrorLogRepository } from './error-log-repository'

describe('errorLog', () => {
	describe('ErrorLogRepository', () => {
		let repository: IErrorLogRepository

		let errorLogModel: {
			create: jest.Mock
			find: jest.Mock
			countDocuments: jest.Mock
			aggregate: jest.Mock
		}

		beforeEach(() => {
			errorLogModel = {
				create: jest.fn(),
				find: jest.fn().mockReturnValue({
					sort: jest.fn().mockReturnValue({
						skip: jest.fn().mockReturnValue({
							limit: jest.fn()
						})
					})
				}),
				countDocuments: jest.fn(),
				aggregate: jest.fn().mockReturnValue(
					Object.assign([{ count: jest.fn() }], {
						sort: jest.fn().mockReturnValue({
							skip: jest.fn().mockReturnValue({
								limit: jest.fn()
							})
						})
					})
				)
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
			it('searches all error logs', async () => {
				await repository.findMany({})

				expect(errorLogModel.find).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find.mock.calls[0]).toEqual([{}])
			})

			it('searches error logs filtered by projectId', async () => {
				const projectId = uuid()

				await repository.findMany({
					projectId
				})

				expect(errorLogModel.find).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find.mock.calls[0]).toEqual([
					{
						projectId
					}
				])
			})

			it('searches error logs filtered by groupingName', async () => {
				const groupingName = uuid()

				await repository.findMany({
					groupingName
				})

				expect(errorLogModel.find).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find.mock.calls[0]).toEqual([
					{
						groupingName
					}
				])
			})

			it('sorts error logs by createdAt', async () => {
				await repository.findMany({})

				expect(errorLogModel.find().sort).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find().sort.mock.calls[0]).toEqual([{ createdAt: -1 }])
			})

			it('searches error logs skipping records', async () => {
				const skip = 12345

				await repository.findMany({}, skip)

				expect(errorLogModel.find().sort().skip).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find().sort().skip.mock.calls[0]).toEqual([skip])
			})

			it('searches error logs limiting records', async () => {
				const limit = 54321

				await repository.findMany({}, 11111, limit)

				expect(errorLogModel.find().sort().skip().limit).toHaveBeenCalledTimes(1)
				expect(errorLogModel.find().sort().skip().limit.mock.calls[0]).toEqual([limit])
			})
		})

		describe('count', () => {
			it('counts all error logs', async () => {
				await repository.count({})

				expect(errorLogModel.countDocuments).toHaveBeenCalledTimes(1)
				expect(errorLogModel.countDocuments.mock.calls[0]).toEqual([{}])
			})

			it('counts error logs filtered by projectId', async () => {
				const projectId = uuid()

				await repository.count({
					projectId
				})

				expect(errorLogModel.countDocuments).toHaveBeenCalledTimes(1)
				expect(errorLogModel.countDocuments.mock.calls[0]).toEqual([
					{
						projectId
					}
				])
			})

			it('counts error logs filtered by groupingName', async () => {
				const groupingName = uuid()

				await repository.count({
					groupingName
				})

				expect(errorLogModel.countDocuments).toHaveBeenCalledTimes(1)
				expect(errorLogModel.countDocuments.mock.calls[0]).toEqual([
					{
						groupingName
					}
				])
			})
		})

		describe('groupForGroupingName', () => {
			it('groups logs by projectId and groupingName', async () => {
				await repository.groupForGroupingName({})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][2]).toMatchObject({
					$group: {
						_id: {
							projectId: '$projectId',
							groupingName: '$groupingName'
						}
					}
				})
			})

			it('searches all error log groups', async () => {
				await repository.groupForGroupingName({})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][0]).toEqual({ $match: {} })
			})

			it('searches error log groups filtered by projectId', async () => {
				const projectId = uuid()

				await repository.groupForGroupingName({
					projectId
				})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][0]).toEqual({
					$match: {
						projectId
					}
				})
			})

			it('searches error log groups filtered by groupingName', async () => {
				const groupingName = uuid()

				await repository.groupForGroupingName({
					groupingName
				})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][0]).toEqual({
					$match: {
						groupingName
					}
				})
			})

			it('sorts error log groups by date', async () => {
				await repository.groupForGroupingName({})

				expect(errorLogModel.aggregate().sort).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate().sort.mock.calls[0]).toEqual([{ date: -1 }])
			})

			it('searches error log groups skipping records', async () => {
				const skip = 12345

				await repository.groupForGroupingName({}, skip)

				expect(errorLogModel.aggregate().sort().skip).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate().sort().skip.mock.calls[0]).toEqual([skip])
			})

			it('searches error log groups limiting records', async () => {
				const limit = 54321

				await repository.groupForGroupingName({}, 11111, limit)

				expect(errorLogModel.aggregate().sort().skip().limit).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate().sort().skip().limit.mock.calls[0]).toEqual([limit])
			})
		})

		describe('countForGroupingName', () => {
			it('groups logs by projectId and groupingName', async () => {
				await repository.countForGroupingName({})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][1]).toMatchObject({
					$group: {
						_id: {
							projectId: '$projectId',
							groupingName: '$groupingName'
						}
					}
				})
			})

			it('counts all error log groups', async () => {
				await repository.countForGroupingName({})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][0]).toEqual({ $match: {} })
			})

			it('counts error log groups filtered by projectId', async () => {
				const projectId = uuid()

				await repository.countForGroupingName({
					projectId
				})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][0]).toEqual({
					$match: {
						projectId
					}
				})
			})

			it('counts error log groups filtered by groupingName', async () => {
				const groupingName = uuid()

				await repository.countForGroupingName({
					groupingName
				})

				expect(errorLogModel.aggregate).toHaveBeenCalledTimes(1)
				expect(errorLogModel.aggregate.mock.calls[0][0][0]).toEqual({
					$match: {
						groupingName
					}
				})
			})
		})
	})
})

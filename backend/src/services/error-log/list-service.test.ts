import { IPager } from '@library'
import { v4 as uuid } from 'uuid'
import { IErrorLogMap } from './mapper'
import { createListService, IListService } from './list-service'
import { IErrorLogRepository, TErrorLogEntity } from './repositories/error-log-repository'

describe('errorLog', () => {
	describe('listService', () => {
		let service: IListService
		let errorLogRepository: jest.Mocked<IErrorLogRepository>
		let errorLogMap: jest.Mocked<IErrorLogMap>
		let pager: jest.Mocked<IPager>

		beforeEach(() => {
			errorLogRepository = {
				create: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn()
			}

			errorLogMap = jest.fn().mockReturnValue({
				id: uuid(),
				projectId: uuid(),
				groupingName: 'aaaaa',
				stackTrace: 'bbbbb',
				level: 'HIGH',
				details: []
			})

			pager = {
				skip: jest.fn(),
				pageCount: jest.fn()
			}

			service = createListService(errorLogRepository, errorLogMap, pager)
		})

		const errorLogFake: TErrorLogEntity = {
			id: uuid(),
			projectId: uuid(),
			groupingName: 'aaaaa',
			stackTrace: 'bbbbb',
			level: 'HIGH',
			details: [
				{
					name: 'ccccc',
					value: 'ddddd'
				},
				{
					name: 'eeeee',
					value: 'fffff'
				}
			]
		}

		it('search all error logs', async () => {
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.findMany).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.findMany.mock.calls[0][0]).toEqual({})
		})

		it('search error logs filtered by projectId', async () => {
			const projectId = uuid()
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				projectId,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.findMany).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.findMany.mock.calls[0][0]).toEqual({
				projectId
			})
		})

		it('search error logs filtered by groupingName', async () => {
			const groupingName = uuid()
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				groupingName,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.findMany).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.findMany.mock.calls[0][0]).toEqual({
				groupingName
			})
		})

		it('count all error logs', async () => {
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.count).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.count.mock.calls[0][0]).toEqual({})
		})

		it('count error logs filtered by projectId', async () => {
			const projectId = uuid()
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				projectId,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.count).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.count.mock.calls[0][0]).toEqual({
				projectId
			})
		})

		it('count error logs filtered by groupingName', async () => {
			const groupingName = uuid()
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				groupingName,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.count).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.count.mock.calls[0][0]).toEqual({
				groupingName
			})
		})

		it('skips records for pagination', async () => {
			const pageIndex = 1
			const pageSize = 30
			const skip = 1000000
			pager.skip.mockReturnValueOnce(skip)
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				pageIndex,
				pageSize
			})

			expect(pager.skip).toHaveBeenCalledTimes(1)
			expect(pager.skip.mock.calls[0][0]).toBe(pageIndex)
			expect(pager.skip.mock.calls[0][1]).toBe(pageSize)
			expect(errorLogRepository.findMany.mock.calls[0][1]).toBe(skip)
		})

		it('limits records for pagination', async () => {
			const pageSize = 30
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				pageIndex: 1,
				pageSize
			})

			expect(errorLogRepository.findMany).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.findMany.mock.calls[0][2]).toBe(pageSize)
		})

		it('maps entities to result', async () => {
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogMap).toHaveBeenCalledTimes(1)
			expect(errorLogMap).toHaveBeenCalledWith(errorLogFake)
		})

		it('returns mapped page', async () => {
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			const result = await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(result.page).toEqual([errorLogMap(errorLogFake)])
		})

		it('returns number of pages', async () => {
			const pageCount = 12345
			pager.pageCount.mockReturnValueOnce(pageCount)
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			const result = await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(result.pageCount).toEqual(pageCount)
		})

		it('returns number of items', async () => {
			const itemCount = 12345
			errorLogRepository.count.mockResolvedValueOnce(itemCount)
			errorLogRepository.findMany.mockResolvedValueOnce([errorLogFake])

			const result = await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(result.itemCount).toEqual(itemCount)
		})
	})
})

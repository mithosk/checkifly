import { IPager } from '@library'
import { v4 as uuid } from 'uuid'
import { createGroupListService, IGroupListService } from './group-list-service'
import { IErrorLogRepository, TGroupingHashGroup } from './repositories/error-log-repository'

describe('errorLog', () => {
	describe('groupListService', () => {
		let service: IGroupListService
		let errorLogRepository: jest.Mocked<IErrorLogRepository>
		let pager: jest.Mocked<IPager>

		beforeEach(() => {
			errorLogRepository = {
				create: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn(),
				groupForGroupingHash: jest.fn(),
				countForGroupingHash: jest.fn()
			}

			pager = {
				skip: jest.fn(),
				pageCount: jest.fn()
			}

			service = createGroupListService(errorLogRepository, pager)
		})

		const groupingHashFake: TGroupingHashGroup = {
			projectId: uuid(),
			groupingName: 'aaaaa',
			groupingHash: 'XXXXXXXXXX',
			level: 'LOW',
			size: 12345,
			date: new Date()
		}

		it('searches all error log groups', async () => {
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.groupForGroupingHash).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.groupForGroupingHash.mock.calls[0][0]).toEqual({})
		})

		it('searches error log groups filtered by projectId', async () => {
			const projectId = uuid()
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				projectId,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.groupForGroupingHash).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.groupForGroupingHash.mock.calls[0][0]).toEqual({
				projectId
			})
		})

		it('searches error log groups filtered by groupingName', async () => {
			const groupingName = uuid()
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				groupingName,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.groupForGroupingHash).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.groupForGroupingHash.mock.calls[0][0]).toEqual({
				groupingName
			})
		})

		it('counts all error log groups', async () => {
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.countForGroupingHash).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.countForGroupingHash.mock.calls[0][0]).toEqual({})
		})

		it('counts error log groups filtered by projectId', async () => {
			const projectId = uuid()
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				projectId,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.countForGroupingHash).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.countForGroupingHash.mock.calls[0][0]).toEqual({
				projectId
			})
		})

		it('counts error log groups filtered by groupingName', async () => {
			const groupingName = uuid()
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				groupingName,
				pageIndex: 1,
				pageSize: 30
			})

			expect(errorLogRepository.countForGroupingHash).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.countForGroupingHash.mock.calls[0][0]).toEqual({
				groupingName
			})
		})

		it('skips groups for pagination', async () => {
			const pageIndex = 1
			const pageSize = 30
			const skip = 1000000
			pager.skip.mockReturnValueOnce(skip)
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				pageIndex,
				pageSize
			})

			expect(pager.skip).toHaveBeenCalledTimes(1)
			expect(pager.skip.mock.calls[0][0]).toBe(pageIndex)
			expect(pager.skip.mock.calls[0][1]).toBe(pageSize)
			expect(errorLogRepository.groupForGroupingHash.mock.calls[0][1]).toBe(skip)
		})

		it('limits groups for pagination', async () => {
			const pageSize = 30
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			await service({
				pageIndex: 1,
				pageSize
			})

			expect(errorLogRepository.groupForGroupingHash).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.groupForGroupingHash.mock.calls[0][2]).toBe(pageSize)
		})

		it('returns mapped page', async () => {
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			const result = await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(result.page).toEqual([
				{
					projectId: groupingHashFake.projectId,
					groupingName: groupingHashFake.groupingName,
					groupingHash: groupingHashFake.groupingHash,
					level: groupingHashFake.level,
					size: groupingHashFake.size,
					date: groupingHashFake.date.toISOString()
				}
			])
		})

		it('returns number of pages', async () => {
			const pageCount = 54321
			pager.pageCount.mockReturnValueOnce(pageCount)
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			const result = await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(result.pageCount).toEqual(pageCount)
		})

		it('returns number of items', async () => {
			const itemCount = 54321
			errorLogRepository.countForGroupingHash.mockResolvedValueOnce(itemCount)
			errorLogRepository.groupForGroupingHash.mockResolvedValueOnce([groupingHashFake])

			const result = await service({
				pageIndex: 1,
				pageSize: 30
			})

			expect(result.itemCount).toEqual(itemCount)
		})
	})
})

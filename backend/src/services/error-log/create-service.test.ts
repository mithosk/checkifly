import { IHash } from '@library'
import { v4 as uuid } from 'uuid'
import { IErrorLogMap } from './mapper'
import { createCreateService, ICreateService } from './create-service'
import { IErrorLogRepository, TErrorLogEntity } from './repositories/error-log-repository'

describe('errorLog', () => {
	describe('createService', () => {
		let service: ICreateService
		let errorLogRepository: jest.Mocked<IErrorLogRepository>
		let errorLogMap: jest.Mocked<IErrorLogMap>
		let hash: jest.Mocked<IHash>

		beforeEach(() => {
			errorLogRepository = {
				create: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn(),
				groupForGroupingHash: jest.fn(),
				countForGroupingHash: jest.fn()
			}

			errorLogMap = jest.fn().mockReturnValue({
				id: uuid(),
				projectId: uuid(),
				groupingName: 'aaaaa',
				groupingHash: 'XXXXXXXXXX',
				stackTrace: 'bbbbb',
				level: 'LOW',
				details: [],
				date: '20250901'
			})

			hash = jest.fn().mockImplementation(text => text)

			service = createCreateService(errorLogRepository, errorLogMap, hash)
		})

		const errorLogFake: TErrorLogEntity = {
			id: uuid(),
			projectId: uuid(),
			groupingName: 'ccccc',
			groupingHash: 'YYYYYYYYYY',
			stackTrace: 'ddddd',
			level: 'MEDIUM',
			details: [
				{
					name: 'eeeee',
					value: 'fffff'
				},
				{
					name: 'ggggg',
					value: 'hhhhh'
				}
			],
			createdAt: new Date()
		}

		it('creates hash for grouping name', async () => {
			const groupingName = 'iiiii'

			await service({
				projectId: uuid(),
				groupingName,
				stackTrace: 'lllll',
				level: 'HIGH',
				details: [
					{
						name: 'mmmmm',
						value: 'nnnnn'
					},
					{
						name: 'ooooo',
						value: 'ppppp'
					}
				]
			})

			expect(hash).toHaveBeenCalledTimes(1)
			expect(hash).toHaveBeenCalledWith(groupingName)
		})

		it('creates a new error log', async () => {
			const projectId = uuid()
			const groupingName = 'iiiii'
			const stackTrace = 'lllll'
			const level = 'HIGH'
			const details = [
				{
					name: 'mmmmm',
					value: 'nnnnn'
				},
				{
					name: 'ooooo',
					value: 'ppppp'
				}
			]

			await service({
				projectId,
				groupingName,
				stackTrace,
				level,
				details
			})

			expect(errorLogRepository.create).toHaveBeenCalledTimes(1)
			expect(errorLogRepository.create.mock.calls[0][0]).toEqual({
				projectId,
				groupingName,
				groupingHash: groupingName,
				stackTrace,
				level,
				details
			})
		})

		it('maps entity to result', async () => {
			errorLogRepository.create.mockResolvedValueOnce(errorLogFake)

			await service({
				projectId: uuid(),
				groupingName: 'iiiii',
				stackTrace: 'lllll',
				level: 'HIGH',
				details: [
					{
						name: 'mmmmm',
						value: 'nnnnn'
					},
					{
						name: 'ooooo',
						value: 'ppppp'
					}
				]
			})

			expect(errorLogMap).toHaveBeenCalledTimes(1)
			expect(errorLogMap).toHaveBeenCalledWith(errorLogFake)
		})

		it('returns mapped result', async () => {
			const result = await service({
				projectId: uuid(),
				groupingName: 'iiiii',
				stackTrace: 'lllll',
				level: 'HIGH',
				details: [
					{
						name: 'mmmmm',
						value: 'nnnnn'
					},
					{
						name: 'ooooo',
						value: 'ppppp'
					}
				]
			})

			expect(result).toEqual(errorLogMap(errorLogFake))
		})
	})
})

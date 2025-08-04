import { v4 as uuid } from 'uuid'
import { IErrorLogMap } from './mapper'
import { createCreateService, ICreateService } from './create-service'
import { IErrorLogRepository, TErrorLogEntity } from './repositories/error-log-repository'

describe('errorLog', () => {
	describe('createService', () => {
		let service: ICreateService
		let errorLogRepository: jest.Mocked<IErrorLogRepository>
		let errorLogMap: jest.Mocked<IErrorLogMap>

		beforeEach(() => {
			errorLogRepository = {
				create: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn(),
				groupForGroupingName: jest.fn(),
				countForGroupingName: jest.fn()
			}

			errorLogMap = jest.fn().mockReturnValue({
				id: uuid(),
				projectId: uuid(),
				groupingName: 'aaaaa',
				stackTrace: 'bbbbb',
				level: 'LOW',
				details: []
			})

			service = createCreateService(errorLogRepository, errorLogMap)
		})

		const errorLogFake: TErrorLogEntity = {
			id: uuid(),
			projectId: uuid(),
			groupingName: 'ccccc',
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

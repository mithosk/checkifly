import { v4 as uuid } from 'uuid'
import { errorLogMap } from './mapper'
import { TErrorLogEntity } from './repositories/error-log-repository'

describe('errorLog', () => {
	describe('errorLogMap', () => {
		const errorLogFake: TErrorLogEntity = {
			id: uuid(),
			projectId: uuid(),
			groupingName: 'aaaaa',
			groupingHash: 'XXXXXXXXXX',
			stackTrace: 'bbbbb',
			level: 'MEDIUM',
			details: [
				{
					name: 'ccccc',
					value: 'ddddd'
				},
				{
					name: 'eeeee',
					value: 'fffff'
				}
			],
			createdAt: new Date()
		}

		it('maps entity to result', async () => {
			const result = errorLogMap(errorLogFake)

			expect(result).toEqual({
				id: errorLogFake.id,
				projectId: errorLogFake.projectId,
				groupingName: errorLogFake.groupingName,
				groupingHash: errorLogFake.groupingHash,
				stackTrace: errorLogFake.stackTrace,
				level: errorLogFake.level,
				details: errorLogFake.details,
				date: errorLogFake.createdAt.toISOString()
			})
		})
	})
})

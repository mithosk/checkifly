import { v4 as uuid } from 'uuid'
import { errorLogMap } from './mapper'
import { TErrorLogEntity } from './repositories/error-log-repository'

describe('errorLog', () => {
	describe('errorLogMap', () => {
		const errorLogFake: TErrorLogEntity = {
			id: uuid(),
			projectId: uuid(),
			groupingName: 'aaaaa',
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
			]
		}

		it('it maps entity to result', async () => {
			const result = errorLogMap(errorLogFake)

			expect(result).toEqual({
				id: errorLogFake.id,
				projectId: errorLogFake.projectId,
				groupingName: errorLogFake.groupingName,
				stackTrace: errorLogFake.stackTrace,
				level: errorLogFake.level,
				details: errorLogFake.details
			})
		})
	})
})

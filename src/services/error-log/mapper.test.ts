import { errorLogMap } from './mapper'
import { TErrorLogEntity } from './repositories/error-log-repository'

describe('errorLog', () => {
	describe('errorLogMap', () => {
		const errorLogFake: TErrorLogEntity = {
			id: 'aaaaa',
			projectId: 'bbbbb',
			groupingName: 'ccccc',
			stackTrace: 'ddddd',
			level: 'LOW',
			details: [
				{
					name: 'eeeee',
					value: 'fffff'
				},
				{
					name: 'ggggg',
					value: 'hhhhh'
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
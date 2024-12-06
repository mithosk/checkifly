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
                create: jest.fn()
            }

            errorLogMap = jest.fn()

            service = createCreateService(errorLogRepository, errorLogMap)
        })

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

        it('creates a new error log', async () => {
            const projectId = 'aaaaa'
            const groupingName = 'bbbbb'
            const stackTrace = 'ccccc'
            const level = 'LOW'
            const details = [
                {
                    name: 'ddddd',
                    value: 'eeeee'
                },
                {
                    name: 'fffff',
                    value: 'ggggg'
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
                projectId: 'xxxxx',
                groupingName: 'yyyyy',
                stackTrace: 'zzzzz',
                level: 'LOW',
                details: [
                    {
                        name: 'kkkkk',
                        value: 'wwwww'
                    },
                    {
                        name: 'jjjjj',
                        value: 'qqqqq'
                    }
                ]
            })

            expect(errorLogMap).toHaveBeenCalledTimes(1)
            expect(errorLogMap).toHaveBeenCalledWith(errorLogFake)
        })
    })
})
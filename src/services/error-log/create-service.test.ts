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
                create: jest.fn()
            }

            errorLogMap = jest.fn().mockReturnValue({
                id: uuid(),
                projectId: uuid(),
                groupingName: 'aaaaa',
                stackTrace: 'bbbbb',
                level: 'HIGH',
                details: []
            })

            service = createCreateService(errorLogRepository, errorLogMap)
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

        it('creates a new error log', async () => {
            const projectId = uuid()
            const groupingName = 'aaaaa'
            const stackTrace = 'bbbbb'
            const level = 'HIGH'
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
            })

            expect(errorLogMap).toHaveBeenCalledTimes(1)
            expect(errorLogMap).toHaveBeenCalledWith(errorLogFake)
        })

        it('returns mapped result', async () => {
            const result = await service({
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
            })

            expect(result).toEqual(errorLogMap(errorLogFake))
        })
    })
})
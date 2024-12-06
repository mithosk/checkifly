import { Static, Type } from '@sinclair/typebox'

const level = Type.Union([
    Type.Literal('LOW'),
    Type.Literal('MEDIUM'),
    Type.Literal('HIGH')
])

//create
export const createErrorLogSchema = Type.Object({
    projectId: Type.String({ format: 'uuid' }),
    groupingName: Type.String({ minLength: 5 }),
    stackTrace: Type.String({ minLength: 10 }),
    level,
    details: Type.Array(
        Type.Object({
            name: Type.String(),
            value: Type.String()
        })
    )
})

export type TCreateErrorLogDto = Static<typeof createErrorLogSchema>

//detail
export const errorLogSchema = Type.Object({
    id: Type.String({ format: 'uuid' }),
    projectId: Type.String({ format: 'uuid' }),
    groupingName: Type.String({ minLength: 5 }),
    stackTrace: Type.String({ minLength: 10 }),
    level,
    details: Type.Array(
        Type.Object({
            name: Type.String(),
            value: Type.String()
        })
    )
})

export type TErrorLogDto = Static<typeof errorLogSchema>
import { Static, Type } from '@sinclair/typebox'
import { pagedQuerystringSchema, pagedResponseSchema } from '@library'

//detail
const errorLogSchema = Type.Object({
    id: Type.String({ format: 'uuid' }),
    projectId: Type.String({ format: 'uuid' }),
    groupingName: Type.String({ minLength: 5 }),
    stackTrace: Type.String({ minLength: 10 }),
    level: Type.Union([
        Type.Literal('LOW'),
        Type.Literal('MEDIUM'),
        Type.Literal('HIGH')
    ]),
    details: Type.Array(
        Type.Object({
            name: Type.String(),
            value: Type.String()
        })
    )
})

export const errorLogsSchema = pagedResponseSchema(errorLogSchema)
export type TErrorLogsDto = Static<typeof errorLogsSchema>

//params
export const errorLogListParamsSchema = Type.Object({
    projectId: Type.String({ format: 'uuid' })
})

export type TErrorLogListParamsDto = Static<typeof errorLogListParamsSchema>

//querystring
export const errorLogQuerystringSchema = pagedQuerystringSchema(
    Type.Object({
        groupingName: Type.Optional(Type.String({ minLength: 5 }))
    })
)

export type TErrorLogQuerystringDto = Static<typeof errorLogQuerystringSchema>
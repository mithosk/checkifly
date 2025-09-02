import { Static, Type } from '@sinclair/typebox'
import { pagedQuerystringSchema, pagedResponseSchema } from '@library'

//detail
const errorLogGroupSchema = Type.Object({
	projectId: Type.String({ format: 'uuid' }),
	groupingName: Type.String({ minLength: 5 }),
	groupingHash: Type.String({ minLength: 64, maxLength: 64 }),
	level: Type.Union([Type.Literal('LOW'), Type.Literal('MEDIUM'), Type.Literal('HIGH')]),
	size: Type.Number(),
	date: Type.String({ format: 'date-time' })
})

export const errorLogGroupsSchema = pagedResponseSchema(errorLogGroupSchema)
export type TErrorLogGroupsDto = Static<typeof errorLogGroupsSchema>

//params
export const errorLogGroupListParamsSchema = Type.Object({
	projectId: Type.String({ format: 'uuid' })
})

export type TErrorLogGroupListParamsDto = Static<typeof errorLogGroupListParamsSchema>

//querystring
export const errorLogGroupQuerystringSchema = pagedQuerystringSchema(
	Type.Object({
		groupingName: Type.Optional(Type.String({ maxLength: 32 }))
	})
)

export type TErrorLogGroupQuerystringDto = Static<typeof errorLogGroupQuerystringSchema>

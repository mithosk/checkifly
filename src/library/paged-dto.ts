import { TArray, TIntersect, TNumber, TObject, TSchema, Type } from '@sinclair/typebox'

export const pagedQuerystringSchema = <T extends TSchema>(querystringSchema: T): TIntersect<[T, TObject<{
    pageIndex: TNumber
    pageSize: TNumber
}>]> =>
    Type.Intersect([
        querystringSchema,
        Type.Object({
            pageIndex: Type.Number({ minimum: 1, default: 1 }),
            pageSize: Type.Number({ minimum: 1, default: 30 })
        })
    ])

export const pagedResponseSchema = <T extends TSchema>(itemSchema: T): TObject<{
    page: TArray<T>;
    pageCount: TNumber
    itemCount: TNumber
}> =>
    Type.Object({
        page: Type.Array(itemSchema),
        pageCount: Type.Number(),
        itemCount: Type.Number()
    })
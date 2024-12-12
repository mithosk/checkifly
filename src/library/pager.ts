export interface IPager {
    skip(pageIndex: number, pageSize: number): number
    pageCount(itemCount: number, pageSize: number): number
}

export class Pager implements IPager {
    public skip(pageIndex: number, pageSize: number): number {
        return (pageIndex - 1) * pageSize
    }

    public pageCount(itemCount: number, pageSize: number): number {
        return Math.ceil(itemCount / pageSize)
    }
}
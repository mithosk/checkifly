type ParamKey = 'PORT' | 'DATABASE_URL'

export interface IGetEnvParam {
    (key: ParamKey): string
}

export const getEnvParam: IGetEnvParam = (key: ParamKey) => {
    const value = process.env[key]

    if (!value)
        throw new Error(`not found parameter '${key}'`)

    return value
}
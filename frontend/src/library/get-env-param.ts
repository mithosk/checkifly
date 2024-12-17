type ParamKey = 'NEXT_PUBLIC_BACKEND_URL'

export const getEnvParam = (key: ParamKey) => {
    let value: string | undefined = undefined

    switch (key) {
        case 'NEXT_PUBLIC_BACKEND_URL':
            value = process.env.NEXT_PUBLIC_BACKEND_URL
            break
    }

    if (!value)
        throw new Error(`not found parameter '${key}'`)

    return value
}
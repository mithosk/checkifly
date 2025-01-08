type TParamKey = 'PORT' | 'API_KEY' | 'DATABASE_URL'

export const getEnvParam = (key: TParamKey) => {
	const value = process.env[key]

	if (!value) throw new Error(`not found parameter '${key}'`)

	return value
}

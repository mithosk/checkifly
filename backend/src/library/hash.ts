export interface IHash {
	(text: string): Promise<string>
}

export const hash: IHash = async (text: string) => {
	const hashArray = Array.from(
		new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))
	)

	return hashArray
		.map(num => num.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase()
}

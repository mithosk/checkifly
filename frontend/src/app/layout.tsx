import './global.css'
import { EnvProvider } from '@components'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const backendUrl = process.env.BACKEND_URL ?? ''

    return (
        <html>
            <head>
                <title>checkifly</title>
            </head>
            <body>
                <EnvProvider backendUrl={backendUrl}>
                    {children}
                </EnvProvider>
            </body>
        </html>
    )
}
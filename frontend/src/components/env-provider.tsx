'use client'

import { createContext, useContext, ReactNode } from 'react'

const context = createContext<{
    backendUrl: string
}>({
    backendUrl: ''
})

export function EnvProvider({
    children,
    backendUrl
}: {
    children: ReactNode,
    backendUrl: string
}) {
    return (
        <context.Provider value={{ backendUrl }}>
            {children}
        </context.Provider>
    )
}

export function GetEnv() {
    return useContext(context)
}
'use client'

import { backendClient } from '@library'
import { useEffect, useState } from 'react'

type TPageData = {
    errorLogs: {
        id: string
        groupingName: string
        stackTrace: string
        level: 'LOW' | 'MEDIUM' | 'HIGH'
    }[]
    errorLogPages: number
    errorLogItems: number
}

export default function Page() {
    const [data, setData] = useState<TPageData>()

    async function getErrorLogs() {
        const response = await backendClient.rest.projects.errorLogs('5a1d854a-8f53-4609-8ffd-40d2855ff77a').list()

        const errorLogItems = response.itemCount
        const errorLogPages = response.pageCount
        const errorLogs = response.page.map(item => {
            return {
                id: item.id,
                groupingName: item.groupingName,
                stackTrace: item.stackTrace,
                level: item.level
            }
        })

        setData({
            errorLogs,
            errorLogPages,
            errorLogItems
        })
    }

    useEffect(() => {
        getErrorLogs()
    }, [])

    return (
        <div>
            <h1>Items: {data?.errorLogItems} &nbsp;/&nbsp; Pages: {data?.errorLogPages}</h1>
            {
                data?.errorLogs.map(item => {
                    return (
                        <div key={item.id}>
                            <span>{item.groupingName} - {item.stackTrace} - {item.level}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}
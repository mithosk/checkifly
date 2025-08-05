'use client'

import Image from 'next/image'
import { GetEnv } from '@components'
import { backendClient } from '@lib'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type TLevel = 'LOW' | 'MEDIUM' | 'HIGH'

type TPageData = {
    items: {
        projectId: string
        groupingName: string
        level: TLevel
        size: number
        date: string
    }[]
}

export default function Page() {
    const env = GetEnv()
    const params = useParams()
    const [data, setData] = useState<TPageData>()

    async function getErrorLogGroups(backendUrl: string, projectId: string) {
        const response = await backendClient.rest.projects.errorLogGroups(backendUrl, projectId).list()

        const items = response.page.map(item => {
            return {
                projectId: item.projectId,
                groupingName: item.groupingName,
                level: item.level,
                size: item.size,
                date: item.date
            }
        })

        setData({
            items
        })
    }

    function getLevelCell(level: TLevel) {
        switch (level) {
            case 'LOW':
                return styles.lowLevelCell

            case 'MEDIUM':
                return styles.mediumLevelCell

            case 'HIGH':
                return styles.highLevelCell
        }
    }

    function getHurryImage(level: TLevel, size: number) {
        if (level === 'HIGH')
            if (size >= 100)
                return '/arrow_upward.svg'
            else
                return '/arrow_forward.svg'

        if (level === 'MEDIUM' && size >= 100)
            return '/arrow_forward.svg'

        return '/arrow_downward.svg'
    }

    useEffect(() => {
        getErrorLogGroups(env.backendUrl, params.id as string)
    }, [env.backendUrl, params.id])

    return (
        <table>
            <tbody>
                {
                    data?.items.map(item => {
                        return (
                            <tr key={item.groupingName}>
                                <td className={getLevelCell(item.level)}></td>
                                <td className={styles.hurryCell}>
                                    <Image src={getHurryImage(item.level, item.size)} width={30} height={30} alt='' />
                                </td>
                                <td className={styles.groupingNameCell}>
                                    {item.groupingName}
                                </td>
                                <td className={styles.dateCell}>{
                                    new Intl.DateTimeFormat(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }).format(new Date(item.date))
                                }</td>
                                <td className={styles.sizeCell}>
                                    {item.size}
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
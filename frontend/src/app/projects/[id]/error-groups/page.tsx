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
        groupingHash: string
        level: TLevel
        size: number
        date: string
    }[],
    itemCount: number
    pagination: {
        index: number,
        count: number
    }
}

export default function Page() {
    const env = GetEnv()
    const params = useParams()
    const [data, setData] = useState<TPageData>()

    async function getErrorLogGroups(backendUrl: string, projectId: string, paginationIndex: number) {
        const response = await backendClient.rest.projects.errorLogGroups(backendUrl, projectId, paginationIndex).list()

        const items = response.page.map(item => {
            return {
                projectId: item.projectId,
                groupingName: item.groupingName,
                groupingHash: item.groupingHash,
                level: item.level,
                size: item.size,
                date: item.date
            }
        })

        setData({
            items,
            itemCount: response.itemCount,
            pagination: {
                index: paginationIndex,
                count: response.pageCount
            }
        })
    }

    async function decreasePagination() {
        await getErrorLogGroups(env.backendUrl, params.id as string, (data?.pagination.index ?? 0) - 1)
    }

    async function increasePagination() {
        await getErrorLogGroups(env.backendUrl, params.id as string, (data?.pagination.index ?? 0) + 1)
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
        getErrorLogGroups(env.backendUrl, params.id as string, 1)
    }, [env.backendUrl, params.id])

    return (
        <div>
            <div className={styles.tableContainer}>
                <table>
                    <tbody>
                        {
                            data?.items.map(item => {
                                return (
                                    <tr key={item.groupingHash}>
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
            </div>
            <div className={styles.footer}>
                <span className={styles.itemCountLabel}>
                    <b>Total:</b> {data?.itemCount}
                </span>
                <span className={styles.paginationLabel}>
                    <b>Page:</b> {data?.pagination.index} / {data?.pagination.count}
                </span>
                <button onClick={decreasePagination} className={styles.decreasePaginationButton} disabled={(data?.pagination.index ?? 0) === 1}>PREV</button>
                <button onClick={increasePagination} className={styles.increasePaginationButton} disabled={(data?.pagination.index ?? 0) >= (data?.pagination.count ?? 0)}>NEXT</button>
            </div>
        </div>
    )
}
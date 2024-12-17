import { z } from 'zod'
import axios from 'axios'
import { getEnvParam } from '@library'

const errorLogSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    groupingName: z.string().min(5),
    stackTrace: z.string().min(10),
    level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    details: z.array(z.object({
        name: z.string(),
        value: z.string()
    }))
})

const errorLogsSchema = z.object({
    page: z.array(errorLogSchema),
    pageCount: z.number(),
    itemCount: z.number()
})

type TErrorLogsDto = z.infer<typeof errorLogsSchema>

export const errorLogs = (projectId: string) => {
    return {
        list: async (): Promise<TErrorLogsDto> => {
            const { data } = await axios.get<TErrorLogsDto>(`${getEnvParam('NEXT_PUBLIC_BACKEND_URL')}/rest/projects/${projectId}/error-logs`)

            errorLogsSchema.parse(data)

            return data
        }
    }
}
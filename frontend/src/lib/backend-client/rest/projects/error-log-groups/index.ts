import { z } from 'zod'
import axios from 'axios'
import { getEnvParam } from '@lib'

const errorLogGroupSchema = z.object({
    projectId: z.string().uuid(),
    groupingName: z.string().min(5),
    level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    size: z.number(),
    date: z.string().datetime()
})

const errorLogGroupsSchema = z.object({
    page: z.array(errorLogGroupSchema),
    pageCount: z.number(),
    itemCount: z.number()
})

type TErrorLogGroupsDto = z.infer<typeof errorLogGroupsSchema>

export const errorLogGroups = (projectId: string) => {
    return {
        list: async (): Promise<TErrorLogGroupsDto> => {
            const { data } = await axios.get<TErrorLogGroupsDto>(`${getEnvParam('NEXT_PUBLIC_BACKEND_URL')}/rest/projects/${projectId}/error-log-groups`)

            errorLogGroupsSchema.parse(data)

            return data
        }
    }
}
import { z } from 'zod'
import axios from 'axios'

const errorLogGroupSchema = z.object({
    projectId: z.string().uuid(),
    groupingName: z.string().min(5),
    groupingHash: z.string().length(64),
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

export const errorLogGroups = (backendUrl: string, projectId: string) => {
    return {
        list: async (): Promise<TErrorLogGroupsDto> => {
            const { data } = await axios.get<TErrorLogGroupsDto>(`${backendUrl}/rest/projects/${projectId}/error-log-groups`)

            errorLogGroupsSchema.parse(data)

            return data
        }
    }
}
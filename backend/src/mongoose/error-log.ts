import { v4 as uuid } from 'uuid'
import { model, Schema } from 'mongoose'

export type TErrorLog = {
    id: string
    projectId: string
    groupingName: string
    stackTrace: string
    level: 'LOW' | 'MEDIUM' | 'HIGH'
    details: {
        name: string
        value: string
    }[]
}

export const errorLogModel = model<TErrorLog>('error-logs', new Schema<TErrorLog>({
    id: { type: String, default: () => uuid(), unique: true, required: true },
    projectId: { type: String, required: true },
    groupingName: { type: String, required: true },
    stackTrace: { type: String, required: true },
    level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    details: [{
        name: { type: String, required: true },
        value: { type: String, required: true }
    }]
}))
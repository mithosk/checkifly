import fastify from 'fastify'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import cors from '@fastify/cors'
import { getEnvParam } from '@library'

//load env
dotenv.config()

//settings
const server = fastify()
server.register(import('./utilities'))
server.register(import('./services'))
server.register(import('./routes'))
server.register(cors)

//startup
server.listen({
	host: '0.0.0.0',
	port: parseInt(getEnvParam('PORT'))
}, () => {
	console.log('Application STARTED')

	mongoose.connect(getEnvParam('DATABASE_URL'), {
		dbName: 'checkyfly'
	}).then(() => {
		console.log('Application CONNECTED to MongoDB')
	})
})
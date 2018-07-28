const path = require('path')
const fastify = require('fastify')({ logger: true })

// routes
const getApplicationPubs = require('./routes/applications/get-applications')
const getApplication = require('./routes/applications/get-application')
const postApplication = require('./routes/applications/post-application')
const postApplicationKnownArchive = require('./routes/known-archives/post-known-archive')

// schemas
const getApplicationSchema = require('./schemas/applications/get-application.json')
const getApplicationsSchema = require('./schemas/applications/get-applications.json')
const postApplicationSchema = require('./schemas/applications/post-application.json')
const postApplicationKnownArchiveSchema = require('./schemas/known-archives/post-known-archive.json')

// utils
const { loadAllArchives } = require('./applications')

async function createServer() {
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
  })

  fastify.get('/', (req, reply) => {
    reply.sendFile('index.html')
  })

  await loadAllArchives()

  fastify.get('/applications', getApplicationsSchema, getApplicationPubs)
  fastify.post('/applications', postApplicationSchema, postApplication)
  fastify.get(
    '/applications/:application',
    getApplicationSchema,
    getApplication
  )

  fastify.post(
    '/known-archives',
    postApplicationKnownArchiveSchema,
    postApplicationKnownArchive
  )

  return fastify
}

module.exports = {
  createServer
}

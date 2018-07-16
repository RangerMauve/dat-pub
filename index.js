const path = require('path')
const fastify = require('fastify')({ logger: true })
const frontPage = require('./routes/front-page')
const getApplicationPubs = require('./routes/get-applications')
const getUsersDat = require('./routes/get-users-dat')
const postApplication = require('./routes/post-application')
const postApplicationUser = require('./routes/post-application-user')
const postApplicationSchema = require('./schemas/post-application')
const postApplicationUserSchema = require('./schemas/post-application-user')
const { loadAllArchives } = require('./applications')

async function createServer() {
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/' // optional: default '/'
  })

  await loadAllArchives()

  fastify.get('/', frontPage)

  fastify.get('/applications', getApplicationPubs)

  fastify.post('/applications', postApplicationSchema, postApplication)

  fastify.get('/applications/:application', getUsersDat)

  fastify.post(
    '/applications/:application/users',
    postApplicationUserSchema,
    postApplicationUser
  )

  return fastify
}

module.exports = {
  createServer
}

const DatArchive = require('node-dat-archive')
const fastify = require('fastify')({ logger: true })

const IS_DAT = /^dat:\/\/.+/

function createServer(archive) {
  fastify.get('/', async (request, reply) => {
    return {
      url: archive.url
    }
  })

  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['url', 'application'],
          properties: {
            url: {
              type: 'string'
            },
            application: {
              type: 'string'
            },
            details: {
              type: 'object'
            }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              location: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    async (request, reply) => {
      const newURL = request.body.url
      const application = request.body.application

      if (!IS_DAT.exec(newURL)) throw new Error('Invalid url')

      const newArchive = new DatArchive(newURL, {
        datOptions: { latest: true }
      })

      const proofLocation = `/.well-known/dat-pubs/${archive.url.slice(6)}.json`
      try {
        const proofData = JSON.parse(await newArchive.readFile(proofLocation))

        if (!proofData || !Array.isArray(proofData.applications)) {
          throw new Error('Invalid format for proof file')
        }

        if (proofData.applications.indexOf(application) === -1) {
          throw new Error(`Missing application in proof list`)
        }

        const recordLocation = `/${application}/${newURL.slice(6)}.json`
        const alreadyExists = await archive.readFile(recordLocation)

        if (alreadyExists) throw new Error('Already registered')

        const recordData = JSON.stringify(request.body.details || {})

        await archive.writeFile(recordLocation, recordData)

        return {
          location: `${archive.url}${recordLocation}`
        }
      } catch (e) {
        const err = new Error(
          `Could not find a valid proof at '${newURL}${proofLocation}'`
        )
        err.statusCode = 403
        throw err
      }
    }
  )

  return fastify
}

module.exports = {
  createServer
}

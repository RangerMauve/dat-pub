const DatArchive = require('node-dat-archive')
const fastify = require('fastify')({ logger: true })
const mkdirp = require('dat-mkdirp')
const datPathExists = require('dat-path-exists')

const IS_DAT = /^dat:\/\/.+/

function createServer(archive) {
  fastify.get('/', async () => {
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
    async (request) => {
      const newURL = request.body.url
      const application = request.body.application

      if (!IS_DAT.exec(newURL)) throw new Error('Invalid url')

      if (!IS_DAT.exec(application)) throw new Error('Invalid application url')

      const newArchive = new DatArchive(newURL, {
        datOptions: { latest: true }
      })

      const proofLocation = `/.well-known/dat-pubs/${archive.url.slice(6)}.json`
      try {
        const file = await newArchive.readFile(proofLocation)
        const proofData = JSON.parse(file)

        if (!proofData || !Array.isArray(proofData.applications)) {
          throw new Error('Invalid format for proof file')
        }

        if (proofData.applications.indexOf(application) === -1) {
          throw new Error(`Missing application (${application}) in proof list`)
        }

        const recordLocation = `/${application.slice(6)}/${newURL.slice(
          6
        )}.json`

        const alreadyExists = await datPathExists(recordLocation, archive)

        if (alreadyExists) throw new Error('Already registered')

        const recordData = JSON.stringify({})

        await mkdirp(`/${application.slice(6)}`, archive)

        await archive.writeFile(recordLocation, recordData)

        return {
          location: `${archive.url}${recordLocation}`
        }
      } catch (e) {
        const err = new Error(
          `${
            e.message
          }. Could not find a valid proof at '${newURL}${proofLocation}'`
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

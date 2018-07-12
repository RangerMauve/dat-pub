const DatArchive = require('node-dat-archive')
const fs = require('fs')
const { createServer } = require('./index')

const DAT_PATH = './pub-archive'

async function main() {
  const archive = fs.existsSync(DAT_PATH)
    ? await DatArchive.load({
        localPath: DAT_PATH
      })
    : await DatArchive.create({
        localPath: DAT_PATH,
        title: 'dat-pub',
        description: 'Service for discovering dats'
      })

  if (archive == null) {
    throw new Error('error when creating or loading archive')
  }

  const fastify = createServer(archive)

  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()

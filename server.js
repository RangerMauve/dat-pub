const { createServer } = require('./index')

async function main() {
  const fastify = await createServer()

  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()

const { getApplicationPubs } = require('../../applications')

module.exports = async (request, reply) => {
  const application = request.params.application

  let archive = getApplicationPubs().get(application)

  if (archive == null) {
    reply.code(404)
    return {}
  }

  return {
    pubArchive: archive.url
  }
}

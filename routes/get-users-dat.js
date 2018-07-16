const { getApplicationPubs } = require('../applications')

module.exports = async request => {
  const application = request.params.application

  let archive = getApplicationPubs().get(application)

  if (archive == null) {
    // TODO: 404
  }

  return {
    data: archive.url
  }
}

const { createApplicationPub } = require('../applications')

module.exports = async request => {
  const archive = await createApplicationPub(request.body.url.slice(6))

  return {
    data: archive.url
  }
}

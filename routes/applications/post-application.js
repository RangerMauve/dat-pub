const DatArchive = require('node-dat-archive')
const { createApplicationPub } = require('../../applications')

module.exports = async request => {
  // return { foo: 'bar' }
  const applicationKey = await DatArchive.resolveName(request.body.url)

  const archive = await createApplicationPub(applicationKey)

  return {
    pubArchive: archive.url
  }
}

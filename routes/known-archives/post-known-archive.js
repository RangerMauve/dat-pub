const DatArchive = require('node-dat-archive')
const datPathExists = require('dat-path-exists')
const {
  getApplicationPubs,
  createApplicationPub
} = require('../../applications')
const { checkArchiveForApprovalOfPub } = require('../../utils')

module.exports = async request => {
  let applicationKey = request.body.application

  const applicationPubs = getApplicationPubs()

  // validate urls
  applicationKey = applicationPubs.has(request.body.application)
    ? request.body.application
    : await DatArchive.resolveName(request.body.application)

  if (applicationKey == null || applicationKey.length !== 64)
    throw new Error('Invalid application url')

  const knownArchiveUrl = request.body.knownArchive

  const resolvedKnownArchiveKey = await DatArchive.resolveName(knownArchiveUrl)

  if (resolvedKnownArchiveKey == null)
    throw new Error('Invalid known archive url')

  if (getApplicationPubs().has(applicationKey) === false) {
    await createApplicationPub(applicationKey)
  }

  try {
    await checkArchiveForApprovalOfPub(applicationKey, resolvedKnownArchiveKey)
  } catch (err) {
    err.statusCode = 403
    throw err
  }

  const knownArchiveRecordLocation = `/${resolvedKnownArchiveKey}.json`

  const applicationPub = getApplicationPubs().get(applicationKey)

  const knownArchiveAlreadyInPub = await datPathExists(
    knownArchiveRecordLocation,
    applicationPub
  )

  if (knownArchiveAlreadyInPub === false) {
    await applicationPub.writeFile(
      knownArchiveRecordLocation,
      JSON.stringify({})
    )
  }

  return {
    pubArchiveEntry: `${applicationPub.url}${knownArchiveRecordLocation}`
  }
}

const datPathExists = require('dat-path-exists')
// TODO: const parseDatUrl = require('parse-dat-url')
const { getApplicationPubs, createApplicationPub } = require('../applications')
const { checkUserArchiveForApprovalOfPub } = require('../utils')

const IS_DAT = /^dat:\/\/.+/

module.exports = async request => {
  // validate urls
  const applicationKey = request.params.application
  if (applicationKey.length !== 64) throw new Error('Invalid application url')
  // TODO: resolve application URL if it isn't known?

  const userUrl = request.body.url
  if (!IS_DAT.exec(userUrl)) throw new Error('Invalid user url')
  // TODO: resolve userUrl

  if (getApplicationPubs().has(applicationKey) === false) {
    await createApplicationPub(applicationKey)
  }

  const applicationPub = getApplicationPubs().get(applicationKey)

  try {
    await checkUserArchiveForApprovalOfPub(
      applicationPub,
      applicationKey,
      userUrl
    )
  } catch (err) {
    err.statusCode = 403
    throw err
  }

  const userRecordLocation = `/${userUrl.slice(6)}.json`

  const userAlreadyInPub = await datPathExists(
    userRecordLocation,
    applicationPub
  )

  if (userAlreadyInPub === false) {
    await applicationPub.writeFile(userRecordLocation, JSON.stringify({}))
  }

  return {
    data: `${applicationPub.url}${userRecordLocation}`
  }
}

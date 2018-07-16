const DatArchive = require('node-dat-archive')

exports.checkUserArchiveForApprovalOfPub = async function(
  applicationPub,
  applicationKey,
  userUrl
) {
  const userArchive = new DatArchive(userUrl, {
    datOptions: { latest: true }
  })

  const proofLocation = `/.well-known/dat-pubs/${applicationPub.url.slice(
    6
  )}.json`

  let file
  try {
    file = await userArchive.readFile(proofLocation)
  } catch (err) {
    throw new Error(
      `Proof file missing: /.well-known/dat-pubs/${applicationPub.url.slice(
        6
      )}.json`
    )
  }

  const proofData = JSON.parse(file)

  if (!proofData || !Array.isArray(proofData.applications)) {
    throw new Error('Invalid format for proof file')
  }

  if (proofData.applications.indexOf(`dat://${applicationKey}`) === -1) {
    throw new Error(
      `Missing application (dat://${applicationKey}) in proof list`
    )
  }
}

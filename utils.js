const DatArchive = require('node-dat-archive')

exports.checkArchiveForApprovalOfPub = async function(
  applicationKey,
  knownArchiveKey
) {
  const knownArchive = new DatArchive(`dat://${knownArchiveKey}`, {
    datOptions: { latest: true }
  })

  const proofLocation = `/.dat-pub/${applicationKey}.json`

  let file

  try {
    file = await knownArchive.readFile(proofLocation)
  } catch (err) {
    throw new Error(`Proof file missing: ${proofLocation}`)
  }

  const proofData = JSON.parse(file)

  if (proofData == null || typeof proofData !== 'object') {
    throw new Error('Invalid format for proof file')
  }

  if (proofData.private) {
    throw new Error('Private applications not yet supported')
  }

  knownArchive._close()
}

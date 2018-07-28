const { getApplicationPubs } = require('../../applications')

module.exports = async () => {
  const archives = Array.from(getApplicationPubs().entries()).map(
    ([url, archive]) => ({
      application: `dat://${url}`,
      pubArchive: archive.url
    })
  )

  return {
    data: archives
  }
}

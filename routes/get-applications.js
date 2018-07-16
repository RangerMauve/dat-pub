const { getApplicationPubs } = require('../applications')

module.exports = async () => {
  const archives = Array.from(getApplicationPubs().entries()).map(
    ([url, archive]) => ({
      application: `dat://${url}`,
      users: archive.url
    })
  )

  return {
    data: archives
  }
}

const DatArchive = require('node-dat-archive')
const { lstatSync, readdirSync } = require('fs')
const { join, basename } = require('path')
const mkdirp = require('mkdirp')

const APPLICATIONS_DIR = join(__dirname, 'applications')

const isDirectory = source => lstatSync(source).isDirectory()

const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(name => basename(name))
    .filter(name => name.length === 64)

mkdirp.sync(APPLICATIONS_DIR)

const archives = new Map()

exports.getApplicationPubs = () => archives

exports.createApplicationPub = async applicationKey => {
  if (archives.has(applicationKey)) {
    return archives.get(applicationKey)
  }

  const localPath = join(APPLICATIONS_DIR, applicationKey, 'pub')

  mkdirp.sync(localPath)

  const archive = await DatArchive.create({
    localPath,
    title: `Known archives for application: dat://${applicationKey}`,
    description: 'Pub archive for application',
    datOptions: { latest: true }
  })

  // wait for archive to be ready for use
  await archive._loadPromise

  await loadAllArchives()

  return archive
}

async function loadAllArchives() {
  const dirs = getDirectories(APPLICATIONS_DIR).filter(
    applicationKey => archives.has(applicationKey) === false
  )

  for (let applicationKey of dirs) {
    const archive = await DatArchive.load({
      localPath: join(APPLICATIONS_DIR, applicationKey, 'pub'),
      datOptions: { latest: true }
    })

    if (archive == null) {
      throw new Error(
        `Error when creating or loading archive for ${applicationKey}`
      )
    }

    archives.set(applicationKey, archive)
  }
}

exports.loadAllArchives = loadAllArchives

const DatArchive = require('node-dat-archive')
const { lstatSync, readdirSync } = require('fs')
const { join, basename } = require('path')
const mkdirp = require('mkdirp')
const sleep = require('sleep-promise')

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
  mkdirp.sync(join(APPLICATIONS_DIR, applicationKey, 'pub'))

  const archive = await DatArchive.create({
    localPath: join(APPLICATIONS_DIR, applicationKey, 'pub'),
    title: `Users of dat://${applicationKey}`,
    description: 'User pub for application',
    datOptions: { latest: true }
  })

  // if I load prematurely, it doesn't work
  sleep(3000).then(loadAllArchives)

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

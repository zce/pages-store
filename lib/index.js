'use strict'

const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const ghpages = require('gh-pages')
const BaseStorage = require('ghost-storage-base')

class CodingStorage extends BaseStorage {
  constructor (config) {
    super()

    if (!config || !config.prefix || !config.repo) {
      throw new Error('Missing required parameters.')
    }

    // Custom gh-pages root url (custom domain)
    this.prefix = config.prefix
    // Repository remote uri
    this.repo = config.repo
    // Repository branch
    this.branch = config.branch || 'gh-pages'
    // Local storage path
    this.localPath = config.path
      ? path.resolve(config.path)
      : path.join(__dirname, '../../../../images/')

    if (!this.repo.startsWith('http')) {
      // repo short name
      this.repo = `https://github.com/${this.repo}.git`
    }
  }

  exists (image, targetDir) {
    const filePath = path.join(targetDir || this.localPath, image)

    return fs.stat(filePath)
      .then(() => true)
      .catch(() => false)
  }

  save (image, targetDir) {
    let targetFilename
    targetDir = targetDir || this.getTargetDir(this.localPath)

    return this.getUniqueFileName(image, targetDir)
      .then(filename => {
        targetFilename = filename
        return fs.mkdirs(targetDir)
      })
      .then(() => {
        // Save to the local
        return fs.copy(image.path, targetFilename)
      })
      .then(() => {
        // Push to the remote repo
        return ghpages.publish(this.localPath, {
          repo: this.repo,
          branch: this.branch
        })
      })
      .then(() => {
        const pathname = path.relative(this.localPath, targetFilename)
        const urlObj = url.parse(this.prefix)
        urlObj.path = urlObj.pathname = path.posix.join(urlObj.pathname, pathname)
        return url.format(urlObj)
      })
      .catch(e => Promise.reject(e))
  }

  serve () {
    return (req, res, next) => next()
  }

  delete () {
    return Promise.reject(new Error('Not implemented'))
  }

  read (options) {
    options = options || {}
    options.path = (options.path || '').replace(/\/$|\\$/, '')

    const targetPath = path.join(this.localPath, options.path)

    return new Promise((resolve, reject) => {
      fs.readFile(targetPath, (err, bytes) => {
        if (!err) resolve(bytes)
        return reject(new Error(` Could not read image: ${options.path}`))
      })
    })
  }
}

module.exports = CodingStorage

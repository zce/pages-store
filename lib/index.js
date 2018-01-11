'use strict'

const url = require('url')
const path = require('path')
const uuid = require('uuid')
const fs = require('fs-extra')
const ghpages = require('gh-pages')
const BaseStorage = require('ghost-storage-base')

class PagesStorage extends BaseStorage {
  constructor (config) {
    super()

    if (!config || !config.prefix || !config.repo) {
      throw new Error('Missing required parameters.')
    }

    // Repository remote uri
    this.repo = config.repo
    // Repository branch
    this.branch = config.branch || 'gh-pages'
    // Avoid showing repository URLs or other information in errors.
    this.silent = config.silent || false

    if (!this.repo.startsWith('http')) {
      // repo short name
      this.repo = `https://github.com/${this.repo}.git`
    }

    // user info
    this.user = config.user || {
      name: 'Pages Storage',
      email: 'storage@zce.me'
    }

    // Custom gh-pages root url (custom domain)
    this.prefix = config.prefix
    this.format = config.format || '{yyyy}/{mm}/{name}{ext}'

    // Local storage path
    this.localPath = config.path
      ? path.resolve(config.path)
      : path.join(__dirname, '../../../../images/')
  }

  exists (filename, targetDir) {
    const filePath = path.join(targetDir || this.localPath, filename)

    return fs.stat(filePath)
      .then(() => true)
      .catch(() => false)
  }

  save (image, targetDir) {
    return this.getFilename(image)
      .then(filename => {
        // Save to the local
        return fs.copy(image.path, filename).then(() => filename)
      })
      .then(filename => {
        // Push to the remote repo
        return ghpages.publish(this.localPath, this).then(() => filename)
      })
      .then(filename => {
        // get image url
        const pathname = path.relative(this.localPath, filename)
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
    options.path = (options.path || '').replace(this.prefix, '')

    const targetPath = path.join(this.localPath, options.path)

    return new Promise((resolve, reject) => {
      fs.readFile(targetPath, (err, bytes) => {
        if (!err) resolve(bytes)
        return reject(new Error(` Could not read image: ${options.path}`))
      })
    })
  }

  /**
   * get uploaded image filename
   */
  getFilename (image) {
    const date = new Date()
    const timestamp = date.getTime()
    const year = this.padLeft(date.getYear() + 1900, 4)
    const month = this.padLeft(date.getMonth() + 1, 2)
    const day = this.padLeft(date.getDate(), 2)

    const random = Math.random().toString().substr(-8)

    const ext = path.extname(image.name)
    const name = path.basename(image.name, ext)

    const pathname = this.format.toLowerCase()
      .replace(/{timestamp}/g, timestamp)
      .replace(/{yyyy}/g, year)
      .replace(/{mm}/g, month)
      .replace(/{dd}/g, day)
      .replace(/{name}/g, name)
      .replace(/{ext}/g, ext)
      .replace(/{random}/g, random)
      .replace(/{uuid}/g, uuid())

    const filename = path.join(this.localPath, pathname)
    const pathObj = path.parse(filename)

    return fs.mkdirs(pathObj.dir).then(() => this.unique(pathObj))
  }

  padLeft (num, length) {
    const prefix = new Array(length).join('0')
    return (prefix + num).substr(-length)
  }

  /**
   * ensure filename is unique
   */
  unique (pathObj, i) {
    const originalName = pathObj.name

    if (i !== undefined) {
      pathObj.name += '-' + i
      pathObj.base = pathObj.name + pathObj.ext
    }

    return this.exists(pathObj.base, pathObj.dir).then(exists => {
      if (!exists) return path.format(pathObj)
      pathObj.name = originalName
      return this.unique(pathObj, i + 1 || 1)
    })
  }
}

module.exports = PagesStorage

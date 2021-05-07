// REQUIRING PACKAGES
const gm = require('gm')
const { readdirSync, unlinkSync } = require('fs')

/**
 * For processing the image
 *
 * @param {Object} options
 * @param {String} options.srcFile
 * @param {Number} options.width
 * @param {Number} options.height
 * @param {String} options.destFile
 */
const ProcessImage = options => {
  return new Promise((resolve, reject) => {
    let { srcFile, width, height, destFile } = options
    gm(srcFile)
      .resize(width, height)
      .gravity('center')
      .quality(100)
      .write(destFile, err =>
        err
          ? reject(err)
          : resolve('Processed!!')
      )
  })
}

/**
 * For deleting all the contents of any folder
 * @param {String} folder
 */
const DeleteAllOfFolder = folder => {
  let files = readdirSync(folder)
  files.map(file => {
    unlinkSync(`${folder}/${file}`)
  })
  return 'Deleted!!'
}

// EXPORTING THEM
module.exports = {
  ProcessImage,
  DeleteAllOfFolder
}

const { ProcessImage, DeleteAllOfFolder } = require('./index')
const { join } = require('path')
const gm = require('gm')
const { mkdirSync, rmdirSync, existsSync } = require('fs')
const j = path => join(__dirname, path)

describe('Sweet tests', () => {

  // before all tests
  beforeAll(() => {
    existsSync(j('/dist')) ? rmdirSync(j('/dist')) : null   // delete dist directory if exists
    mkdirSync(j('/dist'))   // create dist directory
  })

  // after all tests
  afterAll(() =>
    rmdirSync(j('/dist'))   // remove dist when all the tests are completed
  )

  test('should process the given image', async () => {
    let p = await ProcessImage({
      srcFile: j('/src/image-music.jpg'),
      width: 200,
      height: 200,
      destFile: j('/dist/image.png'),
    })
    expect(p).toBe('Processed!!')
  })

  test('Created image should have dimension of 175x200', () => {
    gm(j('/dist/image.png'))
      .size((err, size) => {
        if (size) {
          expect(size.width).toBe(175)
          expect(size.height).toBe(200)
        }
      })
  })

  test('should delete all the files of a given folder', () => {
    let d = DeleteAllOfFolder(j('/dist'))
    expect(d).toBe('Deleted!!')
  })

})

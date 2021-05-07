const TimeAgo = require('./index')

describe('TimeAgo', () => {
  let time = new Date().getTime() - 10000

  it('should return 10 secs ago', () => {
    expect(TimeAgo(time)).toBe('10 secs ago')
  })

  it('should return string type', () => {
    expect(typeof TimeAgo(time)).toBe('string')
  })

})

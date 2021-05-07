const
  chalk = require('chalk'),
  an = require('chalk-animation')

const s = chalk.blue.bold
const e = chalk.bgRed.bold

const success = mssg => console.log(s(mssg))
const error = mssg => console.log(e(mssg))

const rainbow = mssg => setTimeout(() => an.rainbow(mssg).start(), 100)
const radar = mssg => setTimeout(() => an.radar(mssg).start(), 100)

module.exports = {
    success,
    error,
    rainbow,
    radar
}

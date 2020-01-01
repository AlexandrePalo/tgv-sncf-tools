const ora = require('ora')
const chalk = require('chalk')
const moment = require('moment-timezone')
const { travelsProposals } = require('../dist/bundle')

console.log(travelsProposals)

const origin = { code: 'FRADE', name: 'Metz Ville' }
const destination = { code: 'FRPST', name: 'Paris Est' }
const fromDatetime = `${moment()
    .add(1, 'M')
    .format('YYYY-MM-DD')}T10:00:00`
const toDatetime = `${moment(fromDatetime).format('YYYY-MM-DD')}T18:00:00`

console.log(chalk`
{bold TGV-SNCF-TOOLS example:}
Search for trains and proposals
from {red ${origin.name}} to {red ${destination.name}}
the {red ${moment(fromDatetime).format('DD/MM/YYYY')}} between {red ${moment(
    fromDatetime
).format('HH:mm')}} and {red ${moment(toDatetime).format('HH:mm')}}
`)
const spinner = ora('Loading data').start()

travelsProposals(origin.code, destination.code, fromDatetime, toDatetime).then(
    data => {
        console.log('\n')
        console.log(data)
        spinner.stop()
    }
)

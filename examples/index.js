const ora = require('ora')
const chalk = require('chalk')
const moment = require('moment-timezone')
const { travelsProposals } = require('../dist/bundle')

const origin = { code: 'FRADE', name: 'Metz Ville' }
const destination = { code: 'FRPST', name: 'Paris Est' }
let fromDatetime = `${moment()
    .add(1, 'M')
    .format('YYYY-MM-DD')}T10:00:00`

let toDatetime = `${moment(fromDatetime).format('YYYY-MM-DD')}T18:00:00`

const humanizeDuration = duration => {
    return `${Math.trunc(duration / 3600)}h${(duration % 3600) / 60}`
}

console.log(chalk`
{bold TGV-SNCF-TOOLS example:}
Search for trains and proposals
from {red ${origin.name}} to {red ${destination.name}}
the {red ${moment(fromDatetime).format('DD/MM/YYYY')}} between {red ${moment(
    fromDatetime
).format('HH:mm')}} and {red ${moment(toDatetime).format('HH:mm')}}
`)
const spinner = ora('Loading data').start()

// fromDatetime = '2020-03-20T10:00:00'
// toDatetime = null

travelsProposals(origin.code, destination.code, fromDatetime, toDatetime).then(
    data => {
        spinner.stop()

        console.log(chalk`{bold ${data.length}} travels found:`)
        for (let i = 0; i < data.length; i++) {
            const d = data[i]
            const minPrice = d.secondClassOffers
                .concat(d.firstClassOffers)
                .reduce((min, o) => (o.amount < min ? o.amount : min), Infinity)
            const maxPrice = d.secondClassOffers
                .concat(d.firstClassOffers)
                .reduce(
                    (max, o) => (o.amount > max ? o.amount : max),
                    -Infinity
                )
            console.log(
                chalk`#${i + 1} • ${moment(d.departureDate).format(
                    'HH:mm'
                )} → ${moment(d.arrivalDate).format(
                    'HH:mm'
                )} - ${humanizeDuration(d.duration)} - ${
                    d.transporter
                } train n°${
                    d.vehicleNumber
                } - {bold.red [${minPrice}€..${maxPrice}€]}`
            )
        }
    }
)

import fetch from 'node-fetch'
import moment from 'moment-timezone'

async function getWish(originCode, destinationCode, fromDatetime) {
    // Check env variables
    if (!process.env.WISHES_URL || !process.env.FULL_WISH_BASE_URL) {
        throw new Error('getWish - Env variables not properly set.')
    }

    // Check function inputs
    if (
        !originCode ||
        typeof originCode !== 'string' ||
        !(await Station.findOne({ code: originCode })) ||
        !destinationCode ||
        typeof destinationCode !== 'string' ||
        !(await Station.findOne({ code: destinationCode })) ||
        !fromDatetime ||
        !fromDatetime.match(
            /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
        ) ||
        (user && !(typeof user === 'object'))
    ) {
        throw new Error('getWish - Bad function parameters.')
    }

    // API Urls
    const wishesUrl = process.env.WISHES_URL
    const fullWishBaseUrl = process.env.FULL_WISH_BASE_URL

    // Call
    const body = {
        mainJourney: {
            origin: {
                code: originCode
            },
            destination: {
                code: destinationCode
            },
            via: null
        },
        directTravel: true,
        schedule: {
            outward: `${fromDatetime}`,
            outwardType: 'DEPARTURE_FROM',
            inward: null,
            inwardType: 'DEPARTURE_FROM'
        },
        travelClass: 'SECOND', // variable
        passengers: [
            {
                age: 30, // variable
                typology: 'ADULT', // variable YOUND / ADULT
                firstname: '',
                lastname: '',
                customerId: '',
                discountCard,
                fidelityCard: { type: 'NONE', number: '' },
                promoCode: '',
                bicycle: null
            }
        ],
        salesMarket: 'fr-FR'
    }
}

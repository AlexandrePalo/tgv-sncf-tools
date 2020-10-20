import fetch from 'node-fetch'
import { STOP_CODES, URLS } from './constants'

async function getWish(
    originCode: string,
    destinationCode: string,
    fromDatetime: string
) {
    /**
     * Create wish object from SNCF online service, according input parameters.
     * @param {string} originCode - SNCF station code of the origin station, must be in STOP_CODES.
     * @param {string} destinationCode - SNCF station code of the origin station, must be in STOP_CODES.
     * @param {string} fromDatetime - Research start datetime, must be YYYY-MM-DDTHH:mm:ss.
     * @return {object} Wish object created from SNCF online service. Can be used to gather travels proposals from the same service.
     */

    // Check urls variables
    if (!URLS.WISHES_URL || !URLS.FULL_WISH_BASE_URL) {
        throw new Error('getWish - Env variables not properly set.')
    }

    // Check function inputs
    if (
        !originCode ||
        !STOP_CODES.includes(originCode) ||
        !destinationCode ||
        !STOP_CODES.includes(destinationCode) ||
        !fromDatetime ||
        !fromDatetime.match(
            /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
        )
    ) {
        throw new Error('getWish - Bad function parameters.')
    }

    // API Urls
    const wishesUrl = URLS.WISHES_URL
    const fullWishBaseUrl = URLS.FULL_WISH_BASE_URL

    // Call
    const body: any = {
        mainJourney: {
            origin: {
                code: originCode,
            },
            destination: {
                code: destinationCode,
            },
            via: null,
        },
        directTravel: true,
        schedule: {
            outward: `${fromDatetime}`,
            outwardType: 'DEPARTURE_FROM',
            inward: null,
            inwardType: 'DEPARTURE_FROM',
        },
        travelClass: 'SECOND', // variable
        passengers: [
            {
                typology: 'ADULT',
                firstname: '',
                lastname: '',
                customerId: '',
                discountCard: { type: 'NONE', number: '' },
                fidelityCard: { type: 'NONE', number: '' },
                promoCode: '',
                bicycle: null,
            },
        ],
        salesMarket: 'fr-FR',
    }

    // First wish call
    const jsonWishCreated = await fetch(wishesUrl, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        },
    })
        .then(async (res) => {
            return await res.json()
        })
        .catch((err) => {
            throw new Error(
                'getWish - SNCF API response was not expected during first wish call.'
            )
        })
    const wishId = jsonWishCreated.id

    // Pause 200 ms
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Full wish call
    const fullWish = await fetch(`${fullWishBaseUrl}${wishId}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        },
    })
        .then(async (res) => {
            return await res.json()
        })
        .catch((err) => {
            throw new Error(
                'getWish - SNCF API response was not expected during full wish call.'
            )
        })

    return fullWish
}

export default getWish

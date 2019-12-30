import fetch from 'node-fetch'

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

    // First wish call
    const jsonWishCreated = await fetch(wishesUrl, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
        }
    })
        .then(async res => {
            return await res.json()
        })
        .catch(err => {
            throw new Error(
                'getWish - SNCF API response was not expected during first wish call.'
            )
        })
    const wishId = jsonWishCreated.id

    // Pause 200 ms
    await new Promise(resolve => setTimeout(resolve, 200))

    // Full wish call
    const fullWish = await fetch(`${fullWishBaseUrl}${wishId}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
        }
    })
        .then(async res => {
            return await res.json()
        })
        .catch(err => {
            throw new Error(
                'getWish - SNCF API response was not expected during full wish call.'
            )
        })

    return fullWish
}

export default getWish

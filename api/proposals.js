import fetch from 'node-fetch'
import moment from 'moment-timezone'

async function getTravelProposals(fullWish, fromDatetime, toDatetime) {
    // Check env variables
    if (!process.env.TRAIN_URL || !process.env.TRAIN_NEXT_URL) {
        throw new Error('getTravelProposals - Env variables not properly set.')
    }

    // Check function inputs
    if (
        !fullWish ||
        !fromDatetime ||
        !fromDatetime.match(
            /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
        ) ||
        (toDatetime &&
            !toDatetime.match(
                /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
            ))
    ) {
        throw new Error('getTravelProposals - Bad function parameters.')
    }

    // API urls
    const trainUrl = process.env.TRAIN_URL
    const trainNextUrl = process.env.TRAIN_NEXT_URL

    // Call
    let shouldStop = false
    let proposals = []

    // Loop API calls
    do {
        const context =
            proposals.length <= 0
                ? {}
                : {
                      paginationContext: {
                          travelSchedule: {
                              departureDate:
                                  proposals[proposals.length - 1].departureDate,
                              arrivalDate:
                                  proposals[proposals.length - 1].arrivalDate
                          }
                      }
                  }
        const fetchUrl = proposals.length <= 0 ? trainUrl : trainNextUrl

        await new Promise(resolve => setTimeout(resolve, 200))

        await fetch(fetchUrl, {
            method: 'post',
            body: JSON.stringify({ context, wish: fullWish }),
            headers: {
                'Content-Type': 'application/json',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
            }
        })
            .then(async res => {
                return await res.json()
            })
            .then(json => {
                if (proposals.length > 0) {
                    json.travelProposals = json.travelProposals.slice(1)
                }
                proposals = [...proposals, ...json.travelProposals]

                if (json.travelProposals.length <= 0) {
                    // There is no new travel proposals.
                    shouldStop = true
                } else if (toDatetime) {
                    // There is new travel proposals, but the last one is too late.
                    if (
                        moment(
                            json.travelProposals[
                                json.travelProposals.length - 1
                            ].departureDate
                        ).isAfter(toDatetime)
                    ) {
                        shouldStop = true
                    }
                }
            })
            .catch(err => {
                throw new Error(
                    'getTravelProposals - SNCF API response was not expected during proposals call.'
                )
            })
    } while (!shouldStop)
    /*
    Clean proposals
    Some proposals given are before the fromDatetime due to the API. Ex: 18h gives 17h40 train.
    It should be strict.
    */
    proposals = proposals.filter(p => {
        if (
            moment(p.departureDate, 'YYYY-MM-DD[T]HH:mm:ss').isSameOrAfter(
                moment(fromDatetime, 'YYYY-MM-DD[T]HH:mm:ss')
            )
        ) {
            if (toDatetime) {
                if (
                    moment(
                        p.departureDate,
                        'YYYY-MM-DD[T]HH:mm:ss'
                    ).isSameOrBefore(
                        moment(toDatetime, 'YYYY-MM-DD[T]HH:mm:ss')
                    )
                ) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        } else {
            return false
        }
    })

    return proposals
}

export default getTravelProposals

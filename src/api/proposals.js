import fetch from 'node-fetch'
import moment from 'moment-timezone'

import { URLS } from './constants'

async function getTravelsProposalsWithFares(
    fullWish,
    fromDatetime,
    toDatetime
) {
    /**
     * Gather travels proposals from SNCF online service, according to created wish object.
     * @param {object} fullWish - SNCF wish object.
     * @param {string} fromDatetime - Research start datetime, must be YYYY-MM-DDTHH:mm:ss.
     * @param {string} [toDatetime] - Research end datetime, must be YYYY-MM-DDTHH:mm:ss.
     * @return {object} proposals: Array of SNCF travels proposals, see ReadMe for full format details. fares: array of fares conditions.
     */

    // Check env variables
    if (!URLS.TRAIN_URL || !URLS.TRAIN_NEXT_URL) {
        throw new Error('getTravelsProposals - Env variables not properly set.')
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
        throw new Error('getTravelsProposals - Bad function parameters.')
    }

    // API urls
    const trainUrl = URLS.TRAIN_URL
    const trainNextUrl = URLS.TRAIN_NEXT_URL

    // Call
    let shouldStop = false
    let proposals = []
    let fares = []

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
                fares = json.fares

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

    return { proposals, fares }
}

export default getTravelsProposalsWithFares

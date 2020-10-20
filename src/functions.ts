import getTravelsProposalsWithFares from './api/proposals'
import getWish from './api/wish'
import formatTravelsProposals from './api/format'
import { STOP_CODES, URLS } from './api/constants'

const travelsProposals = async (
    originCode: string,
    destinationCode: string,
    fromDatetime: string,
    toDatetime: string = null
) => {
    /**
     * Gather travels proposals from SNCF online service, according to input parameters.
     * @param {string} originCode - SNCF station code of the origin station, must be in STOP_CODES.
     * @param {string} destinationCode - SNCF station code of the origin station, must be in STOP_CODES.
     * @param {string} fromDatetime - Research start datetime, must be YYYY-MM-DDTHH:mm:ss.
     * @param {string} [toDatetime] - Research end datetime if needed, must be YYYY-MM-DDTHH:mm:ss.
     * @return {Array} Array of SNCF travels proposals, see ReadMe for full format details.
     */

    // Check urls variables
    if (
        !URLS.WISHES_URL ||
        !URLS.FULL_WISH_BASE_URL ||
        !URLS.TRAIN_URL ||
        !URLS.TRAIN_NEXT_URL
    ) {
        throw new Error('Env variables not properly set.')
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
        ) ||
        (toDatetime &&
            !toDatetime.match(
                /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
            ))
    ) {
        throw new Error(
            'Bad function parameters, see ReadMe for further information.'
        )
    }

    try {
        // Wish
        const wish = await getWish(originCode, destinationCode, fromDatetime)
        // Pause 200 ms
        await new Promise((resolve) => setTimeout(resolve, 200))
        // Proposals
        const { proposals, fares } = await getTravelsProposalsWithFares(
            wish,
            fromDatetime,
            toDatetime
        )

        return formatTravelsProposals(proposals, fares)
    } catch (err) {
        // Errors may be handle before calls.
        throw err
    }
}

export { travelsProposals }

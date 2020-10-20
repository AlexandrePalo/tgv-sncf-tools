/**
 * @returns {object}: Travel Proposal
 *
 *  @param {string} id - SNCF proposal unique ID, type GUID
 *  @param {string} segmentId - SNCF segment unique ID, type GUID
 *  @param {string} transporter - name of the transporter (TGV INOUI, OUIGO, ...)
 *  @param {number} vehicleNumber - SNCF vehicule number
 *  @param {string} vehicleType - type of vehicule (TRAIN, ...)
 *  @param {array} firstClassOffers - {
 *      @param {string} id - SNCF offer unique ID, type GUID
 *      @param {number} amount - ticket price for this offer
 *      @param {string} flexibility - code of the flexibility type
 *      @param {object} fares - {
 *          @param {string} id - SNCF fares unique ID, type GUID
 *          @param {string} label - name of the fares
 *          @param {string} code - code of the fares
 *          @param {boolean} returnMandatory - true if return is mandatory
 *          @param {string} conditionsVerboseFrench - french wording explaining fares conditions
 *          @param {string} advantageCard - needed advantage card for this fares, none if none needed
 *      }
 *  }
 *  @param {array} secondClassOffers - see firstClassOffers
 *  @param {string} unsellableReason - reason if unsellable, null either
 *  @param {object} origin - {
 *      @param {string} station - name of the station
 *      @param {string} city - name of the station's city
 *      @param {number} longitude - longitude of the station, decimal format
 *      @param {number} latitude - latitude of the station, decimal format
 *  }
 *  @param {object} destination - see origin object
 *  @param {string} departureDate - departure string datetime, format YYYY-MM-DD[T]HH:mm:ss
 *  @param {string} arrivalDate - arrival string datetime, format YYYY-MM-DD[T]HH:mm:ss
 *  @param {number} duration - travel duration in seconds
 *  @param {string} functionalId - '2020-02-01T16:56_8719203-FRADE-FRADE_2872_2020-02-01T18:20_8711300-FRPST-FRPST',
 * }
 */

/**
 * Unused parameters:
 *
 * origin (in its initial format)
 * destination (in its initial format)
 * segments (in its initial format)
 * firstClassOffers (in its initial format)
 * secondClassOffers (in its initial format)
 * aovUrl
 * travelType
 * ouigoAccompanimentMessages
 * highlightMessage
 * doorToDoor
 * minPrice
 * isIncomplete
 * isHighlight
 */

const formatFirstClassOffers = (firstClassOffers: any, fares: any) => {
    return firstClassOffers.offers.map((fco: any) => {
        const f = fares.find(
            (f: any) => f.label === fco.passengerOffers[0].fares[0]
        )
        return {
            id: fco.id,
            amount: fco.amount,
            flexibility: fco.proposalFlexibility.flexibility,
            fares: {
                id: f.id,
                label: f.label,
                code: f.code,
                returnMandatory: f.returnMandatory,
                conditionsVerboseFrench: f.conditions,
                advantageCard: f.advantageCard,
            },
        }
    })
}

const formatSecondClassOffers = (secondClassOffers: any, fares: any) => {
    return secondClassOffers.offers.map((sco: any) => {
        const f = fares.find(
            (f: any) => f.label === sco.passengerOffers[0].fares[0]
        )
        return {
            id: sco.id,
            amount: sco.amount,
            flexibility: sco.proposalFlexibility.flexibility,
            fares: f
                ? {
                      id: f.id,
                      label: f.label,
                      code: f.code,
                      returnMandatory: f.returnMandatory,
                      conditionsVerboseFrench: f.conditions,
                      advantageCard: f.advantageCard,
                  }
                : undefined,
        }
    })
}

const formatTravelsProposals = (travelsProposals: any, fares: any) => {
    return travelsProposals.map((tp: any) => {
        return {
            id: tp.id,
            unsellableReason: tp.unsellableReason
                ? tp.unsellableReason.code
                : null,
            departureDate: tp.departureDate,
            arrivalDate: tp.arrivalDate,
            duration: tp.duration,
            functionalId: tp.functionalId,
            origin: {
                station: tp.origin.station.label,
                city: tp.origin.city.label,
                longitude: tp.origin.longitude,
                latitude: tp.origin.latitude,
            },
            destination: {
                station: tp.destination.station.label,
                city: tp.destination.city.label,
                longitude: tp.destination.longitude,
                latitude: tp.destination.latitude,
            },
            segmentId: tp.segments[0].id,
            transporter: tp.segments[0].transporter,
            vehicleNumber: tp.segments[0].vehicleNumber,
            vehicleType: tp.segments[0].vehicleType,
            firstClassOffers: formatFirstClassOffers(
                tp.firstClassOffers,
                fares
            ),
            secondClassOffers: formatSecondClassOffers(
                tp.secondClassOffers,
                fares
            ),
        }
    })
}

export default formatTravelsProposals

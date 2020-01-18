# TGV SNCF TOOLS   ![npm](https://img.shields.io/npm/v/tgv-sncf-tools) [![Build Status](https://travis-ci.com/AlexandrePalo/tgv-sncf-tools.svg?branch=master)](https://travis-ci.com/AlexandrePalo/tgv-sncf-tools)

This package is a suite of tools to gather informations from the SNCF public website, concerning TGV travels.

SNCF is the french firm to travel by train in France.

## Function `travelsProposals`

### Parameters:

-   `{string} originCode` - SNCF station code of the origin station, must be in STOP_CODES.
-   `{string} destinationCode` - SNCF station code of the origin station, must be in STOP_CODES.
-   `{string} fromDatetime` - Research start datetime, must be YYYY-MM-DDTHH:mm:ss.
-   `{string} [toDatetime]` - Research end datetime if needed, must be YYYY-MM-DDTHH:mm:ss.

### Returned:

-   `{Array}` Array of SNCF travels proposals, including:
    -   Available travels for the given inputs (only direct travels)
    -   Price for available solutions (1st class, 2nd class)
    -   Train number and transporter name (Ouigo, TGV Inoui)
    
- A `travel proposal` is designed as :
```
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
 *  @param {string} functionalId - '2020-02-01T16:56_8719203-FRADE-FRADE_2872_2020-02-01T18:20_8711300-FRPST-FRPST
```

## Testing

Run `npm start test`

## Example

See folder `examples` or run `npm start example`

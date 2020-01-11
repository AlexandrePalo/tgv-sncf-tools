# TGV SNCF TOOLS

This package is a suite of tools to gather informations from the SNCF public website, concerning TGV travels.

SNCF is the french firm to travel by train in France.

## Dunction `travelsProposals`

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

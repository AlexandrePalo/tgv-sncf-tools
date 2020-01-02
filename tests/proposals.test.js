import faker from 'faker'
import moment from 'moment-timezone'

import getTravelsProposalsWithFares from '../src/api/proposals'
import getWish from '../src/api/wish'
import { STOP_CODES } from '../src/api/constants'

describe('Function getTravelProposals', () => {
    const originCode = STOP_CODES[Math.floor(Math.random() * STOP_CODES.length)]
    const destinationCode = STOP_CODES.filter(s => s !== originCode)[
        Math.floor(Math.random() * (STOP_CODES.length - 1))
    ]
    const fromDatetime = `${moment()
        .day(0 + 6)
        .format('YYYY-MM-DD[T]')}08:00:00` // Next saturday
    const toDatetime = `${moment(fromDatetime).format('YYYY-MM-DD[T]')}18:00:00`
    let wish = null

    beforeAll(async done => {
        wish = await getWish(originCode, destinationCode, fromDatetime)
        done()
    })

    test('It should raise an error without proper wish', async () => {
        expect.assertions(1)
        return getTravelsProposalsWithFares(
            faker.random.word(),
            fromDatetime,
            toDatetime
        ).catch(async err => {
            expect(err.message).toBe(
                'getTravelsProposalsWithFares - Bad function parameters.'
            )
        })
    })
    test('It should raise an error without proper fromDatetime', async () => {
        expect.assertions(1)
        return getTravelsProposalsWithFares(
            wish,
            faker.random.word(),
            toDatetime
        ).catch(async err => {
            expect(err.message).toBe(
                'getTravelsProposalsWithFares - Bad function parameters.'
            )
        })
    })
    test('It should raise an error without proper toDatetime if given', async () => {
        expect.assertions(1)
        return getTravelsProposalsWithFares(
            wish,
            fromDatetime,
            faker.random.word()
        ).catch(async err => {
            expect(err.message).toBe(
                'getTravelsProposalsWithFares - Bad function parameters.'
            )
        })
    })

    test('It should return a non empty array with proper inputs', async () => {
        expect.hasAssertions()

        return getTravelsProposalsWithFares(
            wish,
            fromDatetime,
            toDatetime
        ).then(data => {
            const { proposals, fares } = data

            // Proposals
            expect(proposals.length).toBeGreaterThan(0)
            for (let i = 0; i < proposals.length; i++) {
                expect(proposals[i]).toMatchObject({
                    id: expect.stringMatching(
                        /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
                    ),
                    departureDate: expect.stringMatching(
                        /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
                    ),
                    arrivalDate: expect.stringMatching(
                        /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
                    ),
                    duration: expect.any(Number),
                    functionalId: expect.any(String),
                    segments: expect.arrayContaining([
                        expect.objectContaining({
                            vehicleNumber: expect.any(String),
                            transporter: expect.any(String)
                        })
                    ])
                })
                expect(
                    moment(
                        proposals[i].departureDate,
                        'YYYY-MM-DD[T]HH:mm:ss'
                    ).isSameOrAfter(
                        moment(fromDatetime, 'YYYY-MM-DD[T]HH:mm:ss')
                    )
                ).toBeTruthy()
                expect(
                    moment(
                        proposals[i].departureDate,
                        'YYYY-MM-DD[T]HH:mm:ss'
                    ).isSameOrBefore(
                        moment(toDatetime, 'YYYY-MM-DD[T]HH:mm:ss')
                    )
                ).toBeTruthy()
            }

            // Fares
            for (let i = 0; i < fares.length; i++) {
                expect(fares[i]).toMatchObject({
                    id: expect.stringMatching(
                        /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
                    ),
                    label: expect.any(String),
                    code: expect.any(String),
                    returnMandatory: expect.any(Boolean),
                    conditions: expect.any(String),
                    advantageCard: expect.anything()
                })
            }
        })
    })
    test('It should return a non empty array with proper inputs without toDatetime', async () => {
        expect.hasAssertions()

        return getTravelsProposalsWithFares(wish, fromDatetime).then(data => {
            const { proposals, fares } = data

            // Proposals
            expect(proposals.length).toBeGreaterThan(0)
            for (let i = 0; i < proposals.length; i++) {
                expect(proposals[i]).toMatchObject({
                    id: expect.stringMatching(
                        /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
                    ),
                    departureDate: expect.stringMatching(
                        /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
                    ),
                    arrivalDate: expect.stringMatching(
                        /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/g
                    ),
                    duration: expect.any(Number),
                    functionalId: expect.any(String),
                    segments: expect.arrayContaining([
                        expect.objectContaining({
                            vehicleNumber: expect.any(String),
                            transporter: expect.any(String)
                        })
                    ])
                })
                expect(
                    moment(
                        proposals[i].departureDate,
                        'YYYY-MM-DD[T]HH:mm:ss'
                    ).isSameOrAfter(
                        moment(fromDatetime, 'YYYY-MM-DD[T]HH:mm:ss')
                    )
                ).toBeTruthy()
            }

            // Fares
            for (let i = 0; i < fares.length; i++) {
                expect(fares[i]).toMatchObject({
                    id: expect.stringMatching(
                        /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
                    ),
                    label: expect.any(String),
                    code: expect.any(String),
                    returnMandatory: expect.any(Boolean),
                    conditions: expect.any(String),
                    advantageCard: expect.anything()
                })
            }
        })
    })
})

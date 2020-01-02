import faker from 'faker'
import moment from 'moment-timezone'

import getWish from '../src/api/wish'
import { STOP_CODES } from '../src/api/constants'

describe('Function getWish', () => {
    const originCode = STOP_CODES[Math.floor(Math.random() * STOP_CODES.length)]
    const destinationCode = STOP_CODES.filter(s => s !== originCode)[
        Math.floor(Math.random() * (STOP_CODES.length - 1))
    ]
    const fromDatetime = `${moment()
        .day(0 + 6)
        .format('YYYY-MM-DD[T]')}08:00:00` // Next saturday

    test('It should raise an error without proper originCode', async () => {
        expect.assertions(1)
        return getWish(
            faker.random.word(),
            destinationCode,
            fromDatetime
        ).catch(async err => {
            expect(err.message).toBe('getWish - Bad function parameters.')
        })
    })
    test('It should raise an error without proper destinationCode', async () => {
        expect.assertions(1)
        return getWish(originCode, faker.random.word(), fromDatetime).catch(
            async err => {
                expect(err.message).toBe('getWish - Bad function parameters.')
            }
        )
    })
    test('It should raise an error without proper fromDatetime', async () => {
        expect.assertions(1)
        return getWish(originCode, destinationCode, faker.random.word()).catch(
            async err => {
                expect(err.message).toBe('getWish - Bad function parameters.')
            }
        )
    })

    test('It should response with id with proper inputs', async () => {
        expect.assertions(1)

        return getWish(originCode, destinationCode, fromDatetime).then(data => {
            expect(data).toMatchObject({
                id: expect.any(String),
                channel: 'web',
                created: expect.any(String),
                mainJourney: expect.objectContaining({
                    origin: expect.objectContaining({
                        code: originCode
                    }),
                    destination: expect.objectContaining({
                        code: destinationCode
                    })
                }),
                schedule: expect.objectContaining({
                    outward: fromDatetime
                }),
                directTravel: true
            })
        })
    })
})

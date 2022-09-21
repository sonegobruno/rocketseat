import "reflect-metadata";
import ListProviderDayAvailability from './ListProviderDayAvalibilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let listProviderDayAvailability: ListProviderDayAvailability;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailability(fakeAppointmentsRepository);
    });

        it('should be able to list the day availability from provider', async  () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0),
            user_id: '123123'
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0),
            user_id: '123123'
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime();
        })

        const avalability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
            day: 20
        });

        expect(avalability).toEqual(expect.arrayContaining([
            {hour: 8, available: false},
            {hour: 9, available: false},
            {hour: 10, available: false},
            {hour: 14, available: false},
            {hour: 15, available: false},
            {hour: 16, available: true},
            {hour: 13, available: true},
        ]));
    });

});

import "reflect-metadata";
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider
        );
    });

    it('should be able to list the the appointments on a specific day', async  () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            date: new Date(2020, 8, 20, 14, 0, 0),
            user_id: 'user_id'
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            date: new Date(2020, 8, 20, 15, 0, 0),
            user_id: 'user_id'
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider_id',
            year: 2020,
            month: 9,
            day: 20
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });

});

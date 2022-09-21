import "reflect-metadata";
import ListProvidersService from './ListProvidersService';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersService = new ListProvidersService(fakeUserRepository, fakeCacheProvider);
    });

    it('should be able to list the providers', async  () => {
        const user1 = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'bruno@gmail.com',
            password: '123456'
        });

        const user2 = await fakeUserRepository.create({
            name: 'Bruno 2',
            email: 'bruno2@gmail.com',
            password: '123123'
        });

        const loggedUser = await fakeUserRepository.create({
            name: 'Bruno 3',
            email: 'bruno3@gmail.com',
            password: '123456789'
        });

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([
            user1, user2
        ]);
    });

});

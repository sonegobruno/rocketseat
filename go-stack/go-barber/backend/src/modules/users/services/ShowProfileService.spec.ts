import "reflect-metadata";
import ShowProfileService from './ShowProfileService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        showProfileService = new ShowProfileService(fakeUserRepository);
    });

    it('should be able to show the profile', async  () => {
        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'bruno@gmail.com',
            password: '123456'
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('Bruno');
        expect(profile.email).toBe('bruno@gmail.com');
    });

    it('should be able to show the profile', async  () => {
        await expect(showProfileService.execute({
            user_id: 'non-existing-user-id',
        })).rejects.toBeInstanceOf(AppError);
    });
});

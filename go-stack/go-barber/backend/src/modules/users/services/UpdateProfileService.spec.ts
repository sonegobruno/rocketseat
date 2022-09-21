import "reflect-metadata";
import UpdateProfileService from './UpdateProfileService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);
    });

    it('should be able to update the profile', async  () => {
        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'bruno@gmail.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Bruno Sonego',
            email: 'sonego@gmail.com',
        });

        expect(updatedUser.name).toBe('Bruno Sonego');
        expect(updatedUser.email).toBe('sonego@gmail.com');
    });

    it('should not be able to change to another user email', async  () => {
        fakeUserRepository.create({
            name: 'Bruno',
            email: 'bruno@gmail.com',
            password: '123456'
        });

        const user = await fakeUserRepository.create({
            name: 'Teste',
            email: 'teste@gmail.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'Bruno',
            email: 'bruno@gmail.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async  () => {
        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'bruno@gmail.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Bruno Sonego',
            email: 'sonego@gmail.com',
            oldPassword: '123456',
            password: '123123'
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async  () => {
        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'bruno@gmail.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'Bruno Sonego',
            email: 'sonego@gmail.com',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async  () => {
        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'bruno@gmail.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'Bruno Sonego',
            email: 'sonego@gmail.com',
            oldPassword: 'wrong-password',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the profile from non-existing user', async  () => {
        await expect(updateProfileService.execute({
            user_id: 'non-existing-user-id',
            name: 'Bruno',
            email:'sonego@gmail.com',
        })).rejects.toBeInstanceOf(AppError);
    });
});

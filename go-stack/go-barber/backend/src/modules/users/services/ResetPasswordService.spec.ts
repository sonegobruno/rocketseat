import "reflect-metadata";
import ResetPasswordService from './ResetPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;


describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUserRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );
    })

    it('should be able to reset your password', async  () => {
        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'sonego.bruno@gmail.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '123123',
            token,
        });

        const updatedUser = await fakeUserRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('sould not be able to reset the passwrod with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token:'non-exististing-token',
                password:'123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('sould not be able to reset the passwrod with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-exististing-token')

        await expect(
            resetPasswordService.execute({
                token,
                password:'123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if passed more than 2 hours', async  () => {
        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'sonego.bruno@gmail.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: '123123',
                token,
        })).rejects.toBeInstanceOf(AppError);

    });
});

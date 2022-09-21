import "reflect-metadata";
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;


describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUserRepository,
            fakeMailProvider,
            fakeUserTokensRepository
        );
    })

    it('should be able to recover the password usiong the email', async  () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
            name: 'Bruno',
            email: 'sonego.bruno@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'sonego.bruno@gmail.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not to be able to recover a non-existing user password', async () => {
        await expect(sendForgotPasswordEmail.execute({
            email: 'sonego.bruno@gmail.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUserRepository.create({
            name: 'Bruno',
            email: 'sonego.bruno@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'sonego.bruno@gmail.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    })
});

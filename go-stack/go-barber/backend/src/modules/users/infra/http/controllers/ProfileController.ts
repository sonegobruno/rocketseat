import { Request, Response} from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateProfile from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({user_id});

        return response.json(classToClass(user));
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, password, oldPassword } = request.body;

        const updateProfile = container.resolve(UpdateProfile);

        const user = await updateProfile.execute({
            name,
            email,
            password,
            oldPassword,
            user_id
        });


        return response.json(classToClass(user));
    }
}

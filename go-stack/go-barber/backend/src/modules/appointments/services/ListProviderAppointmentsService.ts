import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

@injectable()
class ListProvidersAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ){}

    public async execute({provider_id, month, year, day}:IRequest): Promise<Appointment[]> {
        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);

        if (!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                day,
                month,
                provider_id,
                year
            });

            await this.cacheProvider.save(
                cacheKey,
                classToClass(appointments));
        }



        return appointments;
    }
}

export default ListProvidersAppointmentsService;

import Appointments from '@modules/appointments/infra/typeorm/entities/Appointments';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointments>;
    findByDate(date: Date, provider_id: string): Promise<Appointments | undefined>;
    findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointments[]>
    findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO): Promise<Appointments[]>
}

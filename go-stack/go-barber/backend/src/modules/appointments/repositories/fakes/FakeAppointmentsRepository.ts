import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository{
    private appointments: Appointment[] = [];

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>{
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date) &&
            appointment.provider_id === provider_id
        );

        return findAppointment;
    }

    public async findAllInDayFromProvider({month, provider_id, year, day}: IFindAllInDayFromProviderDTO): Promise<Appointment[]>{
        const appointments = this.appointments.filter(appointment =>
                appointment.provider_id === provider_id &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );

        return appointments;
    }

    public async findAllInMonthFromProvider({month, provider_id, year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>{
        const appointments = this.appointments.filter(appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );

        return appointments;
    }


    public async create({ provider_id, date, user_id }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        appointment.id = uuid();
        appointment.date = date;
        appointment.provider_id = provider_id;
        appointment.user_id = user_id;

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;

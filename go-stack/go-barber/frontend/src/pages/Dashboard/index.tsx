import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-day-picker/lib/style.css';

import { 
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';

interface IMonthAvailabilityItem {
    day: number;
    available: boolean;
}

interface IAppointments {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<IMonthAvailabilityItem[]>([]);
    const [appointments, setAppointments] = useState<IAppointments[]>([]);

    const { signOut, user } = useAuth();
    console.log(user.avatar_url);
    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers ) => {
        if (modifiers.available && !modifiers.disabled) {
            setSelectedDate(day);
        }
    }, [])

    const handleMonthChange = useCallback((month: Date ) => {
        setCurrentMonth(month);
    }, [])

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            }
        }).then(response => {
            setMonthAvailability(response.data);
        });
    },[currentMonth, user.id]);

    useEffect(() => {

        api.get<IAppointments[]>('/appointments/me', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        }).then(response => {
            const appointmentsFormatted = response.data.map(appointment => {
                return {
                    ...appointment,
                    hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
                }
            })

            setAppointments(appointmentsFormatted);
        });
    }, [selectedDate]);

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM",{
            locale: ptBR,
        });
    },[selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, 'cccc',{
            locale: ptBR,
        });
    },[selectedDate]);

    const disabledDays = useMemo(() => {
        const dates = monthAvailability
            .filter(monthDay => monthDay.available === false)
            .map(monthDay => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                const date = new Date(year, month, monthDay.day);

                return date;
            });

        return dates;
    },[currentMonth, monthAvailability]);

    const moningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        });
    },[appointments]);

    const afternoomAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        });
    },[appointments]);

    const nextAppointment = useMemo(() => {
        return appointments.find(appointment => 
            isAfter(parseISO(appointment.date), new Date())
        )
    },[appointments])

    return(
        <Container>
            <Header>           
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber"/>

                    <Profile>
                        <img src={user.avatar_url} alt={user.name}/>
                        <div>
                            <span>Bem-vindo,</span>
                            <Link to="/profile"><strong>{user.name}</strong></Link>
                        </div>
                    </Profile>

                        <button type="button" onClick={signOut}>
                            <FiPower />
                        </button>

                </HeaderContent>
            </Header>
            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        {isToday(selectedDate) && <span>Hoje</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>

                    {isToday(selectedDate) && nextAppointment && (
                        <NextAppointment>
                            <strong>Agendamento a seguir</strong>
                            <div>
                                <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name}/>
                                <strong>{nextAppointment.user.name}</strong>
                                <span>
                                    <FiClock />
                                    {nextAppointment.hourFormatted}
                                </span>
                            </div>
                        </NextAppointment>
                    )}


                    <Section>
                        <strong>Manhã</strong>

                        {moningAppointments.length === 0 && (
                            <p>Nenhum agendamento neste periodo</p>
                        )}

                        {moningAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.hourFormatted}
                                </span>

                                <div>
                                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}

                    </Section>

                    <Section>
                        <strong>Tarde</strong>

                        {afternoomAppointments.length === 0 && (
                            <p>Nenhum agendamento neste periodo</p>
                        )}

                        {afternoomAppointments.map(appointment => (
                            <Appointment key={appointment.id}> 
                                <span>
                                    <FiClock />
                                    {appointment.hourFormatted}
                                </span>

                                <div>
                                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker 
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        fromMonth={new Date()}
                        disabledDays={[
                            {daysOfWeek: [0, 6]},
                            ...disabledDays
                        ]}
                        selectedDays={selectedDate}
                        modifiers={{
                            available: {daysOfWeek: [1, 2, 3, 4, 5]}
                        }}
                        onDayClick={handleDateChange}
                        onMonthChange={handleMonthChange}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro',
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>
    );
}

export default Dashboard;
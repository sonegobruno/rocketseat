import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation, Alert } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/Auth';

import { 
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';
import { Platform } from 'react-native'
import api from '../../services/api';
import { IProviders } from '../Dashboard';

interface IRouteParams {
  providerId: string;
}

interface IAvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
    const route = useRoute();
    const { user } = useAuth();
    const { goBack, navigate } = useNavigation();
    const { providerId } = route.params as IRouteParams;

    const [providers, setProviders] = useState<IProviders[]>([]);
    const [ selectedProvider, setSelectedProvider ] = useState(providerId);
    const [ showDatePicker, setShowDatePicker ] = useState(false);
    const [ selectedDate, setSelectedDate ] = useState(new Date());
    const [ selectedHour, setSelectedHour ] = useState(0);
    const [ availability, setavailability ] = useState<IAvailabilityItem[]>([]);

    useEffect(() => {
      api.get('providers').then(response => {
        setProviders(response.data);
      })
    },[]);

    useEffect(() => {
      api.get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        }
      }).then(response => {
        setavailability(response.data);
      })
    },[selectedDate, selectedProvider]);

    const handleSelectProvider = useCallback((id: string) => {
      setSelectedProvider(id);
    },[])

    const navigateBack = useCallback(() => {
      goBack();
    },[goBack]);

    const handleToggleDatePicker = useCallback(() => {
      setShowDatePicker((state) => !state);
    },[]);

    const handleDateChange = useCallback((event: any, date: Date | undefined) => {
      if(Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if(date) {
        setSelectedDate(date);
      }
    },[]);

    const handleSelectHour = useCallback((hour: number) => {
      setSelectedHour(hour);
    }, [])

    const handleCreateAppointment = useCallback(async () => {
      try {
        const date = new Date(selectedDate);
        date.setHours(selectedHour);
        date.setMinutes(0);

        await api.post('appointments', {
          provider_id: selectedProvider,
          date,
        });

        navigate('AppointmentCreated', { date: date.getTime() });
      } catch(err) {
        Alert.alert(
          'Erro ao criar agendamento',
          'Ocorreu um erro ao tentar criar o agendamento, tenta novamente'
        );
      }
    },[navigate, selectedDate, selectedHour, selectedProvider]);

    const morningAvailability = useMemo(() => {
      return availability
        .filter(({hour}) => hour < 12 )
        .map(({hour, available}) => {
          return {
            hour,
            available,
            hourFormatted: format(new Date().setHours(hour), 'HH:00')
          }
        })
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
      return availability
        .filter(({hour}) => hour >= 12 )
        .map(({hour, available}) => {
          return {
            hour,
            available,
            hourFormatted: format(new Date().setHours(hour), 'HH:00')
          }
        })
    }, [availability]);

    return(
      <Container>
        <Header>
          <BackButton onPress={navigateBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>
          <HeaderTitle>Cabeleireiros</HeaderTitle>

          <UserAvatar source={{ uri: user.avatar_url }} />
        </Header>
        <Content>
          <ProvidersListContainer>
            <ProvidersList 
              horizontal
              showsHorizontalScrollIndicator={false}
              data={providers}
              keyExtractor={(provider) => provider.id}
              renderItem={({item: provider}) => (
                <ProviderContainer
                  selected={provider.id === selectedProvider}
                  onPress={() => {handleSelectProvider(provider.id)}}
                >
                  <ProviderAvatar source ={{ uri: provider.avatar_url}} />
                  <ProviderName
                    selected={provider.id === selectedProvider}
                  >{provider.name}</ProviderName>
                </ProviderContainer>
              )}
            />
          </ProvidersListContainer>

          <Calendar>
            <Title>Escolha a data:</Title>

            <OpenDatePickerButton onPress={handleToggleDatePicker}>
              <OpenDatePickerText>Selecionar outra data</OpenDatePickerText>
            </OpenDatePickerButton>
            {showDatePicker && (<DateTimePicker 
              mode="date"
              display="calendar"
              onChange={handleDateChange}
              value={selectedDate}
            />)}
          </Calendar>

          <Schedule>
            <Title>Escolha um horário</Title>
            <Section>
              <SectionTitle>Manhã</SectionTitle>
              <SectionContent horizontal>
              {morningAvailability.map(({hourFormatted, available, hour}) => (
                <Hour
                  enabled={available} 
                  available={available} 
                  selected={selectedHour === hour}
                  onPress={() => {handleSelectHour(hour)}} 
                  key={hourFormatted}
                >
                  <HourText
                    selected={selectedHour === hour}
                  >{hourFormatted}</HourText>
                </Hour>
              ))}
              </SectionContent>
            </Section>

            <Section>
              <SectionTitle>Tarde</SectionTitle>
              <SectionContent horizontal>
              {afternoonAvailability.map(({hourFormatted, available, hour}) => (
                <Hour
                  enabled={available} 
                  available={available} 
                  selected={selectedHour === hour}
                  onPress={() => {handleSelectHour(hour)}} 
                  key={hourFormatted}
                >
                  <HourText
                    selected={selectedHour === hour}
                  >{hourFormatted}</HourText>
                </Hour>
              ))}
              </SectionContent>
            </Section>
          </Schedule>

          <CreateAppointmentButton onPress={handleCreateAppointment}>
              <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
          </CreateAppointmentButton>
        </Content> 

      </Container>
    );
}

export default CreateAppointment;
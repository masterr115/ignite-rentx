import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { StatusBar } from 'react-native';
import { BackButton } from '../../components/BackButton';

import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentTitle,
  AppointmentQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';
import { FlatList } from 'react-native-gesture-handler';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

interface CarProps {
  car: CarDTO;
  id: string;
  user_id: string;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const navigation = useNavigation()
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }


  useEffect(() => {
    async function fetchCars() {
      try{
        const response = await api.get('/schedules_byuser?user_id=1');
        setCars(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars()
  }, [])

  return (

    <Container>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <BackButton
          color={theme.colors.shape}
          onPress={handleBack}
        />
        <Title>
          Seus agendamentos, {'\n'}
          estão aqui.
        </Title>

        <SubTitle>
          Conforto, segurança e praticidade.
        </SubTitle>

      </Header>

      {loading ? <Load/> :

        <Content>
          <Appointments>
            <AppointmentTitle>Agendamentos feitos</AppointmentTitle>
            <AppointmentQuantity>{cars.length}</AppointmentQuantity>
          </Appointments>

          <FlatList
            data={cars}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CarWrapper>
                <Car
                  data={item.car}
                />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign name="arrowright" size={20} color={theme.colors.title} style={{marginHorizontal: 10}}/>
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>

            )

            }
          />

        </Content>
      
      }
    </Container>

  );
}
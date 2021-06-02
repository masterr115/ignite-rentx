import React, { useEffect, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { format } from 'date-fns';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';
import { Feather } from '@expo/vector-icons';
import { CarDTO } from '../../dtos/CarDTO';

import { api } from '../../services/api';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon'
import { getPlatformDate } from '../../utils/getPlataformDate';

import {
 Container,
 Header,
 CarImages,
 Content,
 Details,
 Description,
 Brand,
 Name,
 Rent,
 Period,
 Price,
 Accessories,
 Footer,
 RentalPeriod,
 CalendarIcon,
 DateInfo,
 DateTitle,
 DateValue,
 RentalPrice,
 RentalPriceLabel,
 RentalPriceDetails,
 RentalPriceQuota,
 RentalPriceTotal,
} from './styles';

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const route = useRoute();
  const theme = useTheme();

  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.rent.price)

  async function handleConfirmRental() {
    setLoading(true);
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);
    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates
    ];

    await api.post('schedules_byuser', {
      user_id: 1,
      car,
      startDate: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endDate: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
    })

    api.put(`/schedules_bycars/${car.id}`, {
      id: car.id,
      unavailable_dates
    }).then(() => navigation.navigate('SchedulingComplete')).catch(() =>{
      Alert.alert('Não foi possível confirmar o agendamento.')
      setLoading(false);
    })
    
  }

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
    })
  }, [])

  return (

   <Container>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
     <Header>
        <BackButton 
          onPress={handleBack}
        />
     </Header>
     <CarImages>
      <ImageSlider imagesUrl={car.photos}/>
     </CarImages>
     
     <Content>
      <Details>
        <Description>
          <Brand>{car.brand}</Brand>
          <Name>{car.name}</Name>
        </Description>
        <Rent>
          <Period>{car.rent.period}</Period>
          <Price>R$ {car.rent.price}</Price>
        </Rent>
      </Details>


      <Accessories>
        { car.accessories.map(accessory => (
            <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcon(accessory.type)!} />
          ))
        }
      </Accessories>

      <RentalPeriod>
        <CalendarIcon>
          <Feather name="calendar" size={RFValue(24)} color={theme.colors.shape} />
        </CalendarIcon>
        <DateInfo>
          <DateTitle>DE</DateTitle>
          <DateValue>{rentalPeriod.start}</DateValue>
        </DateInfo>
        <Feather name='chevron-right' size={RFValue(10)} color={theme.colors.text}/>
        <DateInfo>
          <DateTitle>ATÉ</DateTitle>
          <DateValue>{rentalPeriod.end}</DateValue>
        </DateInfo>
      </RentalPeriod>

      <RentalPrice>
        <RentalPriceLabel>TOTAL</RentalPriceLabel>
        <RentalPriceDetails>
          <RentalPriceQuota>R$ {car.rent.price} x{dates.length} diárias</RentalPriceQuota>
          <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
        </RentalPriceDetails>
      </RentalPrice>

     </Content>

     <Footer>
       <Button
        title="Alugar agora"
        color={theme.colors.success}
        onPress={handleConfirmRental}
        loading={loading}
        enabled={!loading}
       />
     </Footer>

   </Container>

  );
}
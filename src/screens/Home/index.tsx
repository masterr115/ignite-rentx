import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

import Logo from '../../assets/logo.svg';

import {
 Container,
 Header,
 HeaderContent,
 TotalCars,
 CarList,
 MyCarsButton
} from './styles';

export function Home() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarDTO[]>([]);
  const theme = useTheme();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car });
  }

  function handleMyCars() {
    navigation.navigate('MyCars');
  }

  useEffect(() => {
    async function fetchCard() {
      try{
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [])

  return (

    <Container>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)} 
            height={RFValue(12)} 
          />
          <TotalCars>Total de 12 carros</TotalCars>
        </HeaderContent>
      </Header>
      {loading ? <Load/> :
        <CarList
          data={cars}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)}/>
          )}        
        />
      }
      <MyCarsButton onPress={handleMyCars}>
        <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape}/>
      </MyCarsButton>
    </Container>

  );
}
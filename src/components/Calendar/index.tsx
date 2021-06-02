import React from 'react';
import { 
  Calendar as CustomCalendar, 
  LocaleConfig, 
  DateCallbackHandler
} from 'react-native-calendars';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons'

import { generateInterval } from './generateInterval';
import { ptBR } from './localeConfig';

LocaleConfig.locales['pt-BR'] = ptBR;
LocaleConfig.defaultLocale = 'pt-BR';

interface MarkedDatesProps {
  [date: string] : {
    color: string;
    textColor: string;
    disabled?: boolean;
    disabledTouchEvent?: boolean;
  }
}

interface CalendarProps {
  markedDates: MarkedDatesProps;
  onDayPress: DateCallbackHandler;
}

interface DayProps {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
}

function Calendar({ markedDates, onDayPress } : CalendarProps) {
  const theme = useTheme();

  return (

    <CustomCalendar
      renderArrow={( direction ) => 
        <Feather size={24} color={theme.colors.text} name={direction == 'left' ? 'chevron-left' : 'chevron-right'}/>
      }
      headerStyle={{
        backgroundColor: theme.colors.background_secondary,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.text_detail,
        paddingBottom: 10,
        marginBottom: 10
      }}
      theme={{
        textDayFontFamily: theme.fonts.primary_400,
        textDayHeaderFontFamily: theme.fonts.primary_500,
        textDayHeaderFontSize: 10,
        textMonthFontSize: 20,
        monthTextColor: theme.colors.title,
        textMonthFontFamily: theme.fonts.secondary_600,
        arrowStyle: {
          marginHorizontal: -15
        }
      }}
      firstDay={1}
      minDate={new Date()}
      markingType="period"
      markedDates={markedDates}
      onDayPress={onDayPress}
    />

  );
}

export {
  Calendar,
  MarkedDatesProps,
  DayProps,
  generateInterval
}
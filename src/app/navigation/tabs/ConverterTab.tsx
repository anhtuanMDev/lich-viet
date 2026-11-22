import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConverterScreen } from '@features/converter';

import { useStackOptions } from '../hooks/useStackOptions';
import { LARGE_TITLE } from '../stackShared';
import { TITLES } from '../titles';

import type { ConverterStackParamList } from '../types';

const ConverterStack = createNativeStackNavigator<ConverterStackParamList>();

export function ConverterTab() {
  const screenOptions = useStackOptions();
  return (
    <ConverterStack.Navigator screenOptions={screenOptions}>
      <ConverterStack.Screen
        name="ConverterHome"
        component={ConverterScreen}
        options={{ ...LARGE_TITLE, title: TITLES.converter }}
      />
    </ConverterStack.Navigator>
  );
}

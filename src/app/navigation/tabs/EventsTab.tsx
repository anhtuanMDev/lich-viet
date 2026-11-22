import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EventsScreen } from '@features/events';

import { headerActions } from '../headerOptions';
import { useStackOptions } from '../hooks/useStackOptions';
import { LARGE_TITLE, addAndSettingsActions } from '../stackShared';
import { TITLES } from '../titles';

import type { EventsStackParamList } from '../types';

const EventsStack = createNativeStackNavigator<EventsStackParamList>();

export function EventsTab() {
  const screenOptions = useStackOptions();
  return (
    <EventsStack.Navigator screenOptions={screenOptions}>
      <EventsStack.Screen
        name="EventsHome"
        component={EventsScreen}
        options={({ navigation }) => ({
          ...LARGE_TITLE,
          title: TITLES.events,
          ...headerActions(addAndSettingsActions(navigation)),
        })}
      />
    </EventsStack.Navigator>
  );
}

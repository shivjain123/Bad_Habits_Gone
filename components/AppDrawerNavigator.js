import { createDrawerNavigator } from 'react-navigation-drawer';

import SettingsScreen from '../screens/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import LogBookScreen from '../screens/LogBookScreen';
import CustomSideBarMenu from './CustomSideBarMenu';

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    LogBook: {
      screen: LogBookScreen,
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: 'Home',
  }
);

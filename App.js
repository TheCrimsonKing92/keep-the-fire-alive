import { createBottomTabNavigator, createAppContainer } from 'react-navigation'

import Home from './components/screens/Home'
import Settings from './components/screens/Settings'
import Skills from './components/screens/Skills'
import Stats from './components/screens/Stats'

const TabNavigator = createBottomTabNavigator({
  Home: {screen: Home},
  Settings: {screen: Settings},
  Skills: {screen: Skills},
  Stats: {screen: Stats}
});

export default createAppContainer(TabNavigator)

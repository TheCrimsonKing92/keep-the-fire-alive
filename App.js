import { createBottomTabNavigator, createAppContainer } from 'react-navigation'

import Home from './components/screens/Home'

const TabNavigator = createBottomTabNavigator({
  Home: {screen: Home}
});

export default createAppContainer(TabNavigator)

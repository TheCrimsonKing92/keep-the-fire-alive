import { Animated, Easing } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'

import Home from './components/screens/Home'
import Settings from './components/screens/Settings'
import Skills from './components/screens/Skills'
import Stats from './components/screens/Stats'

const StackNavigator = createStackNavigator({
  Home: {screen: Home},
  Settings: {screen: Settings},
  Skills: {screen: Skills},
  Stats: {screen: Stats}
},{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
  transitionConfig : () => ({
    transitionSpec: {
      duration: 0,
      timing: Animated.timing,
      easing: Easing.step0,
    },
  })
});

export default createAppContainer(StackNavigator)

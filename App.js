import React from 'react';
import { createBottomTabNavigator } from 'react-navigation'

import Home from './components/screens/Home'

const TabNavigator = createBottomTabNavigator(
{
  Home: {
    screen: Home
  }
}, 
{
  initialRouteName: 'Home'
});

export default class App extends React.Component {

  render() {
    return <TabNavigator />;
  }
}

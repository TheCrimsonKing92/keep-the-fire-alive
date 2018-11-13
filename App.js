import React from 'react';
import { Alert, StatusBar, StyleSheet, Text, View } from 'react-native';
import Banner from './components/Banner';
import Footer from './components/Footer';
import NameSaver from './components/NameSaver'
import TheFire from './components/TheFire';

const LOG_COLOR = '#654321';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.onPressFire = this.onPressFire.bind(this);
  }

  componentDidMount() {
    StatusBar.setHidden(true);
  }
  
  onPressFire() {
    Alert.alert('TheFire pressed', 'You pressed TheFire!')
  }

  render() {
    return (
      <View style={styles.container}>
        <Banner />
        <NameSaver />
        <Text style={styles.normalText}>Open up App.js to start working on your app!</Text>
        <TheFire onPress={ this.onPressFire } />
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueBlock: {
    flex: 1,
    width: '100%',
  },
  normalText: {
    flex: 1,
    backgroundColor: 'purple'
  },
  firstLog: {
    width: 90,
    marginLeft: 17,
    height: 4,
    backgroundColor: LOG_COLOR
  },
  secondLog: {
    width: 100,
      marginLeft: 12,
      height: 4,
      backgroundColor: LOG_COLOR
  },
  thirdLog: {
    width: 110,
      marginLeft: 7,
      height: 4,
      backgroundColor: LOG_COLOR
  },
  orangeLayer: {
    width: 55,
    marginLeft: 35,
    height: 6,
    backgroundColor: 'orange'
  },
  redLayer: {
    width: 75,
    marginLeft: 25,
    height: 4,
    backgroundColor: 'red'
  },
  yellowLayer: {
    width: 35,
    marginLeft: 45,
    height: 3,
    backgroundColor: 'yellow'
  }
});

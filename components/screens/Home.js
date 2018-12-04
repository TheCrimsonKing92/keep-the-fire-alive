import React from 'react'
import { Alert, StatusBar, StyleSheet, Text, View } from 'react-native';
import Banner from '../Banner';
import Footer from '../Footer';
import NameSaver from '../NameSaver'
import TheFire from '../TheFire';

export default class Home extends React.Component {
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
        <Text style={styles.normalText}>Open up my diiiiiiiiiiiiiiiiick!</Text>
        <TheFire onPress={ this.onPressFire } />
        <Footer />
      </View>
    );
  }
};

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
  }
});
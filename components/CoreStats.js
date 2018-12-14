import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { TEMPERATURE_THRESHOLD } from '../Constants';

const between = (val, min, max = 0) => {
  if (val < min) return false;

  if (max === 0) return true;

  return val < max;
}

const Chilled = () => <Text style={{color: 'lightblue'}}>Chilled</Text>;
const Freezing = () => <Text style={{color: 'blue'}}>Freezing!</Text>;
const Thawed = () => <Text style={{color: 'green'}}>Thawed</Text>;
const Warm = () => <Text style={{color: 'orange'}}>Warm</Text>;
const Hot = () => <Text style={{color: 'red'}}>Hot!</Text>;

export default class CoreStats extends React.PureComponent {
  constructor(props) {
    super(props);

    this.fireBetween = this.fireBetween.bind(this);
  }
  fireBetween(min, max = 0) {
    return between(this.props.fireHealth, min, max);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Player Health {this.props.playerHealth}</Text>
        <Text>Fire Health {this.props.fireHealth}</Text>
        { this.fireBetween(0, TEMPERATURE_THRESHOLD.CHILLED) && <Freezing />}
        { this.fireBetween(TEMPERATURE_THRESHOLD.CHILLED, TEMPERATURE_THRESHOLD.THAWED) && <Chilled />}
        { this.fireBetween(TEMPERATURE_THRESHOLD.THAWED, TEMPERATURE_THRESHOLD.WARM) && <Thawed />}
        { this.fireBetween(TEMPERATURE_THRESHOLD.WARM, TEMPERATURE_THRESHOLD.HOT) && <Warm />}
        { this.fireBetween(TEMPERATURE_THRESHOLD.HOT) && <Hot />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderColor: 'black',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 8,
    width: '100%',
  },
  flexChild: {
    flex: 1,
    marginLeft: 3,
    marginRight: 3
  }
});
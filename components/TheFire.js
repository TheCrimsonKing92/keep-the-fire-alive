import React from 'react'
import { Stylesheet, TouchableWithoutFeedback, View } from 'react-native'

const LOG_COLOR = '#654321';

const styles = {
  logs: {
    first: {
      width: 90,
      marginLeft: 17,
      height: 4,
      backgroundColor: LOG_COLOR
    },
    second: {
      width: 100,
      marginLeft: 12,
      height: 4,
      backgroundColor: LOG_COLOR
    },
    third: {
      width: 110,
      marginLeft: 7,
      height: 4,
      backgroundColor: LOG_COLOR
    }
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
};

export default class TheFire extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View>
          <View style={styles.yellowLayer} />
          <View style={styles.orangeLayer} />
          <View style={styles.redLayer} />
          <View style={styles.logs.first} />
          <View style={styles.logs.second} />
          <View style={styles.logs.third} />
        </View>        
      </TouchableWithoutFeedback>
    )
  }
};
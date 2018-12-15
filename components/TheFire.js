import React from 'react'
import { Stylesheet, TouchableOpacity, View } from 'react-native'

const LOG_COLOR = '#654321';

const styles = {
  logs: {
    first: {
      width: 90,
      marginLeft: 10,
      height: 4,
      backgroundColor: LOG_COLOR
    },
    second: {
      width: 100,
      marginLeft: 5,
      height: 4,
      backgroundColor: LOG_COLOR
    },
    third: {
      width: 110,
      height: 4,
      backgroundColor: LOG_COLOR
    }
  },
  orangeLayer: {
    width: 55,
    marginLeft: 28,
    height: 6,
    backgroundColor: 'orange'
  },
  redLayer: {
    width: 75,
    marginLeft: 18,
    height: 4,
    backgroundColor: 'red'
  },
  yellowLayer: {
    width: 35,
    marginLeft: 38,
    height: 3,
    backgroundColor: 'yellow'
  },
  container: {
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3
  },
  disabled: {
    opacity: 0.2
  }
};

export default class TheFire extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity disabled={this.props.disabled} onPress={this.props.onPress}>
        <View style={this.props.disabled ? [styles.container, styles.disabled] : [styles.container]}>
          <View style={styles.yellowLayer} />
          <View style={styles.orangeLayer} />
          <View style={styles.redLayer} />
          <View style={styles.logs.first} />
          <View style={styles.logs.second} />
          <View style={styles.logs.third} />
        </View>    
      </TouchableOpacity>
    )
  }
};
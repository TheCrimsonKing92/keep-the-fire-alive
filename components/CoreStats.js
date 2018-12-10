import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class CoreStats extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text>Player Health {this.props.playerHealth}</Text>
        <Text>Fire Health {this.props.fireHealth}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    borderColor: 'black',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 5,
    paddingLeft: 5,
    width: '50%'
  }
});
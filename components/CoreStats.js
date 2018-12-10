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
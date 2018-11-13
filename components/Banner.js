import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default class Banner extends React.PureComponent {
  render() {
    return (
      <View style={{ alignItems: 'center', width: '100%' }}>
        <Text style={{ textAlign: 'center', backgroundColor: 'teal', fontSize: 25, fontWeight: 'bold', letterSpacing: 5, width: '100%' }} >
          Keep The Fire Alive!
        </Text>
        <Text style={{ textAlign: 'center', backgroundColor: 'red', fontWeight: 'bold', width: '100%' }}>
          By: TheCrimsonKing92
        </Text>
      </View>      
    )
  }
};
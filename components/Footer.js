import React from 'react'
import { Text, View } from 'react-native'

export default class Footer extends React.PureComponent {
  render() {
    return (
      <View style={{ alignItems: 'center', width: '100%'}}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', width: '100%'}}>
          Copyright © 2018
        </Text>
      </View>
    )
  }
}
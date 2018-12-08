import React from 'react'
import { Text, View } from 'react-native'

export default Welcome = ({name}) => {
  return (
    <View>
      <Text>Welcome, { name }</Text>
    </View>
  );
};
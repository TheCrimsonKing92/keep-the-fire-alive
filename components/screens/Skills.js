import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class Skills extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Skills</Text>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
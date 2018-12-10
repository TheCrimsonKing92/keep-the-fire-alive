import React from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'

const styles = StyleSheet.create({
  dirt: {
    backgroundColor: 'brown',
    height: 80,
    width: 110
  },
  disabled: {
    opacity: 0.6
  }
})

export default class TheDirt extends React.Component {
  render() {
    const currentStyles = this.props.disabled ? [styles.dirt, styles.disabled] : [styles.dirt];
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={currentStyles}/>        
      </TouchableHighlight>
    )
  }
};
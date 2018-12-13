import React from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'

const styles = StyleSheet.create({
  dirt: {
    backgroundColor: 'brown',
    height: 80,
    width: 110,
    marginLeft: 3,
    marginRight: 3
  },
  disabled: {
    opacity: 0.6
  }
})

export default class TheDirt extends React.Component {
  render() {
    const currentStyles = this.props.disabled ? [styles.dirt, styles.disabled] : [styles.dirt];
    return (
      <TouchableHighlight disabled={this.props.disabled} onPress={this.props.onPress}>
        <View style={currentStyles}/>        
      </TouchableHighlight>
    )
  }
};
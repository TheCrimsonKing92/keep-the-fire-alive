import React from 'react'
import { Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

export default class StyleableButton extends React.Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress(e) {
    if (this.props.disabled) {
      return;
    }

    this.props.onPress(e);
  }

  render() {
    const customButton = this.props.buttonStyle ? this.props.buttonStyle : {};
    const customContainer = this.props.containerStyle ? this.props.containerStyle : {};
    const customText = this.props.textStyle ? this.props.textStyle : {};
    const buttonStyle = this.props.disabled ? styles.buttonDisabled : styles.button;
    const textStyle = this.props.disabled ? styles.textDisabled : styles.text;
    return (
      <TouchableHighlight style={customContainer} onPress={this.onPress}>
        <View style={[buttonStyle, customButton]}>
          <Text style={[textStyle, customText]}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: Platform.select({
    ios: {},
    android: {
      elevation: 4,
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  text: {
    textAlign: 'center',
    padding: 8,
    ...Platform.select({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '500',
      },
    }),
  },
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 2,
      backgroundColor: '#dfdfdf',
      borderRadius: 2
    },
  }),
  textDisabled: {
    padding: 8,
    ...Platform.select({
      ios: {
        color: '#cdcdcd',
      },
      android: {
        color: '#a1a1a1',
      },
    })
  }
});
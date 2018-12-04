import React from 'react'
import { Alert, AsyncStorage, Button, Text, TextInput, View } from 'react-native'

export default class NameSaver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      savedName: ''
    }
  }
  displayName() {
    return (
      <View>
        <Text>Welcome, { this.props.name }</Text>
        <Button title="Counter" onPress={this.props.onCounter}>Count</Button>
        <Text>{ this.props.count } Counted</Text>
      </View>
    )
  }
  requestName() {
    return (
      <View style={{ width: '100%' }}>
        <Text>Enter your name</Text>
        <TextInput placeholder="Name" onChangeText={ name => this.setState({name})}/>
        <Button title="Save Name" onPress={e => this.props.onNameSaved(this.state.name)}>Save</Button>
      </View>
    )
  }

  render() {
    return (
      <View>
        { this.props.name === '' ? this.requestName() : this.displayName() }
      </View>
    )
  }
};